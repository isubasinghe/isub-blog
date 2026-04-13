import { createSignal, For } from 'solid-js';

const CAPACITY = 8;
const RING_RADIUS = 80;
const RING_CENTER = 110;
const SLOT_SIZE = 36;

const WRITER_CODE = [
  'for (int i = 0; i < N; i++) {',
  '    int h = load(&head);            // own',
  '    if (h - tail_cache == 8) {',
  '        tail_cache = load(&tail);   // CROSS-CORE',
  '        if (h - tail_cache == 8)',
  '            { spin; continue; }',
  '    }',
  '    buffer[h & 7] = i;',
  '    store(&head, h + 1);            // own',
  '}',
];

const READER_CODE = [
  'for (int i = 0; i < N; i++) {',
  '    int t = load(&tail);            // own',
  '    if (head_cache == t) {',
  '        head_cache = load(&head);   // CROSS-CORE',
  '        if (head_cache == t)',
  '            { spin; continue; }',
  '    }',
  '    sum += buffer[t & 7];',
  '    store(&tail, t + 1);            // own',
  '}',
];

type Step = {
  title: string;
  description: string;
  head: number;
  tail: number;
  tailCache: number;
  headCache: number;
  tailCacheStale: boolean;
  headCacheStale: boolean;
  writerHL: number[];
  readerHL: number[];
  ownLoads: number;
  crossCoreLoads: number;
  stores: number;
  activeSlot?: number;
  activeAction?: 'write' | 'read';
};

const STEPS: Step[] = [
  {
    title: 'Initial state',
    description:
      'head = 0, tail = 0. The writer holds a local tail_cache (0), the reader holds a local head_cache (0). These are plain integers — no atomics, no cross-core traffic to read them.',
    head: 0, tail: 0, tailCache: 0, headCache: 0,
    tailCacheStale: false, headCacheStale: false,
    writerHL: [0], readerHL: [0],
    ownLoads: 0, crossCoreLoads: 0, stores: 0,
  },
  {
    title: 'Writer writes 3 items',
    description:
      'Each iteration: load own head (Relaxed — L1 hit, ~1 cycle), check h - tail_cache. 0 < 8, 1 < 8, 2 < 8 — cache says not full every time. No cross-core load of tail needed. 3 own loads, 0 cross-core loads, 3 stores.',
    head: 3, tail: 0, tailCache: 0, headCache: 0,
    tailCacheStale: false, headCacheStale: true,
    writerHL: [1, 2, 7, 8], readerHL: [],
    ownLoads: 3, crossCoreLoads: 0, stores: 3,
    activeSlot: 2, activeAction: 'write',
  },
  {
    title: 'Reader: head_cache says empty!',
    description:
      'Reader loads own tail (0). Checks: head_cache(0) == t(0). Looks empty — but the writer already wrote 3 items. head_cache is stale. The reader must pay for a cross-core load of head. Snoops it from the writer\'s L1. Gets 3. Updates head_cache = 3.',
    head: 3, tail: 0, tailCache: 0, headCache: 3,
    tailCacheStale: false, headCacheStale: false,
    writerHL: [], readerHL: [1, 2, 3],
    ownLoads: 4, crossCoreLoads: 1, stores: 3,
  },
  {
    title: 'Reader reads slot 0',
    description:
      'head_cache(3) != t(0). Not empty. Reader reads buffer[0] directly via pointer. Stores tail = 1 (Release). One own load + one store, no cross-core load needed — head_cache was fresh.',
    head: 3, tail: 1, tailCache: 0, headCache: 3,
    tailCacheStale: true, headCacheStale: false,
    writerHL: [], readerHL: [7, 8],
    ownLoads: 4, crossCoreLoads: 1, stores: 4,
    activeSlot: 0, activeAction: 'read',
  },
  {
    title: 'Writer fills remaining slots',
    description:
      'Writer writes slots 3\u20137. Each time: load own head, check h - tail_cache(0). 3 < 8, 4 < 8, 5 < 8, 6 < 8, 7 < 8 — all pass. The cache is stale (real tail is 1) but it doesn\'t matter — even with tail=0 the queue isn\'t full. 5 writes, 0 cross-core loads.',
    head: 8, tail: 1, tailCache: 0, headCache: 3,
    tailCacheStale: true, headCacheStale: true,
    writerHL: [1, 2, 7, 8], readerHL: [],
    ownLoads: 9, crossCoreLoads: 1, stores: 9,
    activeSlot: 7, activeAction: 'write',
  },
  {
    title: 'Writer: tail_cache says full!',
    description:
      'h = 8. Check: 8 - tail_cache(0) = 8 = capacity. Cache says full! But tail is really 1. Writer pays for a cross-core load: snoops tail from the reader\'s L1. Gets 1. Updates tail_cache = 1. Now 8 - 1 = 7 < 8. Not full after all.',
    head: 8, tail: 1, tailCache: 1, headCache: 3,
    tailCacheStale: false, headCacheStale: true,
    writerHL: [1, 2, 3], readerHL: [],
    ownLoads: 10, crossCoreLoads: 2, stores: 9,
  },
  {
    title: 'Writer wraps to slot 0',
    description:
      'h & 7 = 8 & 7 = 0. Writes buffer[0], stores head = 9. Done. 10 queue operations, 22 atomic ops total. Without caching it was 30. But the real win: cross-core loads dropped from 10 to 2. That\'s 80% less coherence traffic on the interconnect.',
    head: 9, tail: 1, tailCache: 1, headCache: 3,
    tailCacheStale: false, headCacheStale: true,
    writerHL: [7, 8], readerHL: [],
    ownLoads: 10, crossCoreLoads: 2, stores: 10,
    activeSlot: 0, activeAction: 'write',
  },
];

function filledSlots(head: number, tail: number): Set<number> {
  const set = new Set<number>();
  for (let k = tail; k < head; k++) {
    set.add(k % CAPACITY);
  }
  return set;
}

function slotPos(index: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / CAPACITY;
  return {
    x: RING_CENTER + RING_RADIUS * Math.cos(angle) - SLOT_SIZE / 2,
    y: RING_CENTER + RING_RADIUS * Math.sin(angle) - SLOT_SIZE / 2,
  };
}

function markerPos(index: number, offset: number, perpendicular: number = 0) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / CAPACITY;
  const r = RING_RADIUS + offset;
  return {
    x: RING_CENTER + r * Math.cos(angle) + perpendicular * -Math.sin(angle),
    y: RING_CENTER + r * Math.sin(angle) + perpendicular * Math.cos(angle),
  };
}

function CodeColumn(props: { title: string; lines: string[]; highlighted: number[]; color: string }) {
  return (
    <div class="rbc-code-col">
      <div class="rbc-code-col-title" style={{ color: props.color }}>{props.title}</div>
      <div class="rbc-code">
        <For each={props.lines}>
          {(line, i) => (
            <div
              class={`rbc-code-line ${props.highlighted.includes(i()) ? 'hl' : ''}`}
              style={{
                'border-left-color': props.highlighted.includes(i()) ? props.color : 'transparent',
                background: props.highlighted.includes(i())
                  ? `${props.color}20`
                  : 'transparent',
              }}
            >
              {line || ' '}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default function RingBufferCachedAnimation() {
  const [stepIndex, setStepIndex] = createSignal(0);
  const step = () => STEPS[stepIndex()];
  const filled = () => filledSlots(step().head, step().tail);

  const prev = () => setStepIndex((i) => Math.max(0, i - 1));
  const next = () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));

  const slotColor = (i: number) => {
    const s = step();
    if (s.activeSlot === i && s.activeAction === 'write') return '#e67e22';
    if (s.activeSlot === i && s.activeAction === 'read') return '#27ae60';
    if (filled().has(i)) return '#3498db';
    return '#ddd';
  };

  const slotTextColor = (i: number) => {
    const s = step();
    if (s.activeSlot === i) return '#fff';
    if (filled().has(i)) return '#fff';
    return '#666';
  };

  const headSlot = () => step().head % CAPACITY;
  const tailSlot = () => step().tail % CAPACITY;
  const total = () => step().ownLoads + step().crossCoreLoads + step().stores;

  return (
    <>
      <style>{`
        .rbc-container {
          font-family: system-ui, -apple-system, sans-serif;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          background: #fafafa;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }
        .rbc-step-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .rbc-step-counter {
          font-size: 13px;
          color: #888;
          margin-bottom: 12px;
        }
        .rbc-description {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #333;
          min-height: 6.4em;
        }
        .rbc-code-columns {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) {
          .rbc-code-columns {
            flex-direction: column;
          }
        }
        .rbc-code-col {
          flex: 1;
          min-width: 0;
        }
        .rbc-code-col-title {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .rbc-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.5;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          padding: 10px;
          overflow-x: auto;
        }
        .rbc-code-line {
          padding: 1px 4px;
          white-space: pre;
          border-left: 3px solid transparent;
          transition: background 0.2s ease;
        }
        .rbc-code-line.hl {
          border-left-width: 3px;
          border-left-style: solid;
        }
        .rbc-mid-row {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .rbc-ring {
          position: relative;
          width: ${RING_CENTER * 2}px;
          height: ${RING_CENTER * 2}px;
          flex-shrink: 0;
        }
        .rbc-slot {
          position: absolute;
          width: ${SLOT_SIZE}px;
          height: ${SLOT_SIZE}px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid transparent;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .rbc-marker {
          position: absolute;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          padding: 2px 5px;
          border-radius: 3px;
        }
        .rbc-side-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 180px;
        }
        .rbc-cache-panel {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px;
          background: #fff;
        }
        .rbc-cache-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #555;
        }
        .rbc-cache-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-family: monospace;
          padding: 2px 0;
        }
        .rbc-cache-val {
          font-weight: bold;
          padding: 1px 6px;
          border-radius: 3px;
          min-width: 2ch;
          text-align: right;
          display: inline-block;
        }
        .rbc-cache-val.stale {
          background: #fdebd0;
          color: #e67e22;
        }
        .rbc-cache-val.fresh {
          background: #e8f8f5;
          color: #1a8a6a;
        }
        .rbc-atomic-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .rbc-atomic-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 4px;
          background: #fff;
          border: 1px solid #ddd;
        }
        .rbc-atomic-label {
          color: #555;
        }
        .rbc-atomic-val {
          font-weight: bold;
          font-family: monospace;
          font-size: 15px;
          display: inline-block;
          min-width: 2ch;
          text-align: right;
        }
        .rbc-atomic-cross {
          border-color: #e74c3c;
          background: #fdf2f2;
        }
        .rbc-atomic-total {
          border-color: #555;
          background: #f5f5f5;
        }
        .rbc-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 16px;
        }
        .rbc-controls button {
          padding: 6px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
        }
        .rbc-controls button:hover:not(:disabled) {
          background: #eee;
        }
        .rbc-controls button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .rbc-legend {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-top: 14px;
          flex-wrap: wrap;
          font-size: 12px;
        }
        .rbc-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .rbc-legend-swatch {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }
      `}</style>
      <div class="rbc-container">
        <div class="rbc-step-title">{step().title}</div>
        <div class="rbc-step-counter">
          Step {stepIndex() + 1} of {STEPS.length}
        </div>
        <div class="rbc-description">{step().description}</div>

        {/* Side-by-side code */}
        <div class="rbc-code-columns">
          <CodeColumn
            title="Thread A (Writer)"
            lines={WRITER_CODE}
            highlighted={step().writerHL}
            color="#e74c3c"
          />
          <CodeColumn
            title="Thread B (Reader)"
            lines={READER_CODE}
            highlighted={step().readerHL}
            color="#3498db"
          />
        </div>

        {/* Ring + side panel */}
        <div class="rbc-mid-row">
          <div class="rbc-ring">
            <For each={Array.from({ length: CAPACITY }, (_, i) => i)}>
              {(i) => {
                const pos = slotPos(i);
                return (
                  <div
                    class="rbc-slot"
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`,
                      background: slotColor(i),
                      color: slotTextColor(i),
                      'border-color':
                        headSlot() === i && tailSlot() === i
                          ? '#e74c3c'
                          : headSlot() === i
                          ? '#e74c3c'
                          : tailSlot() === i
                          ? '#2980b9'
                          : 'transparent',
                    }}
                  >
                    {i}
                  </div>
                );
              }}
            </For>

            {/* Head marker */}
            {(() => {
              const same = headSlot() === tailSlot();
              const pos = markerPos(headSlot(), 32, same ? -20 : 0);
              return (
                <div
                  class="rbc-marker"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    background: '#e74c3c',
                    color: '#fff',
                  }}
                >
                  H={step().head}
                </div>
              );
            })()}

            {/* Tail marker */}
            {(() => {
              const same = headSlot() === tailSlot();
              const pos = markerPos(tailSlot(), 32, same ? 20 : 0);
              return (
                <div
                  class="rbc-marker"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    background: '#2980b9',
                    color: '#fff',
                  }}
                >
                  T={step().tail}
                </div>
              );
            })()}

            {/* Center label */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                'text-align': 'center',
                'font-size': '12px',
                color: '#999',
              }}
            >
              <div>{step().head - step().tail}/{CAPACITY}</div>
              <div style={{ 'font-size': '11px' }}>used</div>
            </div>
          </div>

          {/* Side panel: caches + atomic counters */}
          <div class="rbc-side-panel">
            {/* Cached values */}
            <div class="rbc-cache-panel">
              <div class="rbc-cache-title">Cached Counters</div>
              <div class="rbc-cache-row">
                <span style={{ color: '#e74c3c' }}>tail_cache</span>
                <span class={`rbc-cache-val ${step().tailCacheStale ? 'stale' : 'fresh'}`}>
                  {step().tailCache}
                </span>
              </div>
              <div class="rbc-cache-row">
                <span style={{ color: '#3498db' }}>head_cache</span>
                <span class={`rbc-cache-val ${step().headCacheStale ? 'stale' : 'fresh'}`}>
                  {step().headCache}
                </span>
              </div>
            </div>

            {/* Atomic ops */}
            <div class="rbc-atomic-panel">
              <div class="rbc-atomic-row">
                <span class="rbc-atomic-label">Own loads</span>
                <span class="rbc-atomic-val" style={{ color: '#1a8a6a' }}>{step().ownLoads}</span>
              </div>
              <div class="rbc-atomic-row rbc-atomic-cross">
                <span class="rbc-atomic-label" style={{ 'font-weight': 'bold' }}>Cross-core loads</span>
                <span class="rbc-atomic-val" style={{ color: '#e74c3c' }}>{step().crossCoreLoads}</span>
              </div>
              <div class="rbc-atomic-row">
                <span class="rbc-atomic-label">Stores</span>
                <span class="rbc-atomic-val" style={{ color: '#e67e22' }}>{step().stores}</span>
              </div>
              <div class="rbc-atomic-row rbc-atomic-total">
                <span class="rbc-atomic-label" style={{ 'font-weight': 'bold' }}>Total</span>
                <span class="rbc-atomic-val">{total()}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rbc-controls">
          <button onClick={prev} disabled={stepIndex() === 0}>
            &#x25C0; Prev
          </button>
          <button onClick={next} disabled={stepIndex() === STEPS.length - 1}>
            Next &#x25B6;
          </button>
          <button onClick={() => setStepIndex(0)}>Reset</button>
        </div>

        <div class="rbc-legend">
          <div class="rbc-legend-item">
            <div class="rbc-legend-swatch" style={{ background: '#ddd' }} />
            Empty
          </div>
          <div class="rbc-legend-item">
            <div class="rbc-legend-swatch" style={{ background: '#3498db' }} />
            Filled
          </div>
          <div class="rbc-legend-item">
            <div class="rbc-legend-swatch" style={{ background: '#e67e22' }} />
            Writing
          </div>
          <div class="rbc-legend-item">
            <div class="rbc-legend-swatch" style={{ background: '#27ae60' }} />
            Reading
          </div>
          <div class="rbc-legend-item">
            <div class="rbc-legend-swatch" style={{ background: '#e8f8f5', border: '1px solid #1a8a6a' }} />
            Cache fresh
          </div>
          <div class="rbc-legend-item">
            <div class="rbc-legend-swatch" style={{ background: '#fdebd0', border: '1px solid #e67e22' }} />
            Cache stale
          </div>
        </div>
      </div>
    </>
  );
}
