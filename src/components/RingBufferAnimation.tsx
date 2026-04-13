import { createSignal, For } from 'solid-js';

const CAPACITY = 8;
const RING_RADIUS = 80;
const RING_CENTER = 110;
const SLOT_SIZE = 36;

const WRITER_CODE = [
  'for (int i = 0; i < N; i++) {',
  '    int h = load(&head);       // atomic',
  '    int t = load(&tail);       // atomic',
  '    if (h - t == 8) {',
  '        spin_loop(); continue;',
  '    }',
  '    buffer[h & 7] = i;',
  '    store(&head, h + 1);       // atomic',
  '}',
];

const READER_CODE = [
  'for (int i = 0; i < N; i++) {',
  '    int t = load(&tail);       // atomic',
  '    int h = load(&head);       // atomic',
  '    if (h == t) {',
  '        spin_loop(); continue;',
  '    }',
  '    sum += buffer[t & 7];',
  '    store(&tail, t + 1);       // atomic',
  '}',
];

type Step = {
  title: string;
  description: string;
  head: number;
  tail: number;
  writerHL: number[];
  readerHL: number[];
  atomicLoads: number;
  atomicStores: number;
  activeSlot?: number;
  activeAction?: 'write' | 'read';
};

const STEPS: Step[] = [
  {
    title: 'Initial state',
    description:
      'head = 0, tail = 0. Both threads are about to enter their loops. No atomic operations yet.',
    head: 0, tail: 0,
    writerHL: [0], readerHL: [0],
    atomicLoads: 0, atomicStores: 0,
  },
  {
    title: 'Writer: check if full',
    description:
      'Writer loads head (0) and tail (0). Two atomic loads. h - t = 0 < 8, so the queue is not full.',
    head: 0, tail: 0,
    writerHL: [1, 2, 3], readerHL: [],
    atomicLoads: 2, atomicStores: 0,
  },
  {
    title: 'Writer: write slot 0, advance head',
    description:
      'h & 7 = 0. Writer writes value into buffer[0]. Then atomically stores head = 1. One atomic store.',
    head: 1, tail: 0,
    writerHL: [6, 7], readerHL: [],
    atomicLoads: 2, atomicStores: 1,
    activeSlot: 0, activeAction: 'write',
  },
  {
    title: 'Writer writes 2 more items',
    description:
      'Same sequence twice: 2 atomic loads + 1 atomic store each. head advances to 3. Slots 0, 1, 2 are filled. That\'s 6 atomic loads and 3 atomic stores for 3 items.',
    head: 3, tail: 0,
    writerHL: [1, 2, 6, 7], readerHL: [],
    atomicLoads: 6, atomicStores: 3,
    activeSlot: 2, activeAction: 'write',
  },
  {
    title: 'Reader: check if empty',
    description:
      'Reader loads tail (0) and head (3). Two atomic loads. h == t? 3 == 0? No. Queue is not empty.',
    head: 3, tail: 0,
    writerHL: [], readerHL: [1, 2, 3],
    atomicLoads: 8, atomicStores: 3,
  },
  {
    title: 'Reader: read slot 0, advance tail',
    description:
      't & 7 = 0. Reader reads buffer[0]. Atomically stores tail = 1. Slot 0 is freed. One atomic store.',
    head: 3, tail: 1,
    writerHL: [], readerHL: [6, 7],
    atomicLoads: 8, atomicStores: 4,
    activeSlot: 0, activeAction: 'read',
  },
  {
    title: 'Writer fills remaining slots',
    description:
      'Writer writes slots 3 through 7. Five iterations: 10 atomic loads + 5 atomic stores. head is now 8. Slots 1\u20137 are filled, slot 0 is free.',
    head: 8, tail: 1,
    writerHL: [1, 2, 6, 7], readerHL: [],
    atomicLoads: 18, atomicStores: 9,
    activeSlot: 7, activeAction: 'write',
  },
  {
    title: 'Writer wraps around to slot 0',
    description:
      'h & 7 = 8 & 7 = 0. The bitmask wraps in one instruction. Writer writes buffer[0] and stores head = 9. Every single queue operation cost 3 atomic ops: 2 loads + 1 store. For 9 writes and 1 read, that\u2019s 30 total. Can we do better?',
    head: 9, tail: 1,
    writerHL: [6, 7], readerHL: [],
    atomicLoads: 20, atomicStores: 10,
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
  // perpendicular shifts the marker sideways (tangent to the circle)
  return {
    x: RING_CENTER + r * Math.cos(angle) + perpendicular * -Math.sin(angle),
    y: RING_CENTER + r * Math.sin(angle) + perpendicular * Math.cos(angle),
  };
}

function CodeColumn(props: { title: string; lines: string[]; highlighted: number[]; color: string }) {
  return (
    <div class="rb-code-col">
      <div class="rb-code-col-title" style={{ color: props.color }}>{props.title}</div>
      <div class="rb-code">
        <For each={props.lines}>
          {(line, i) => (
            <div
              class={`rb-code-line ${props.highlighted.includes(i()) ? 'hl' : ''}`}
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

export default function RingBufferAnimation() {
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

  return (
    <>
      <style>{`
        .rb-container {
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
        .rb-step-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .rb-step-counter {
          font-size: 13px;
          color: #888;
          margin-bottom: 12px;
        }
        .rb-description {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #333;
          min-height: 4.8em;
        }
        .rb-code-columns {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) {
          .rb-code-columns {
            flex-direction: column;
          }
        }
        .rb-code-col {
          flex: 1;
          min-width: 0;
        }
        .rb-code-col-title {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .rb-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.5;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          padding: 10px;
          overflow-x: auto;
        }
        .rb-code-line {
          padding: 1px 4px;
          white-space: pre;
          border-left: 3px solid transparent;
          transition: background 0.2s ease;
        }
        .rb-code-line.hl {
          border-left-width: 3px;
          border-left-style: solid;
        }
        .rb-mid-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .rb-ring {
          position: relative;
          width: ${RING_CENTER * 2}px;
          height: ${RING_CENTER * 2}px;
          flex-shrink: 0;
        }
        .rb-slot {
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
        .rb-marker {
          position: absolute;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          padding: 2px 5px;
          border-radius: 3px;
        }
        .rb-atomic-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 160px;
        }
        .rb-atomic-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 4px;
          background: #fff;
          border: 1px solid #ddd;
        }
        .rb-atomic-label {
          color: #555;
        }
        .rb-atomic-val {
          font-weight: bold;
          font-family: monospace;
          font-size: 15px;
          display: inline-block;
          min-width: 2ch;
          text-align: right;
        }
        .rb-atomic-total {
          border-color: #e74c3c;
          background: #fdf2f2;
        }
        .rb-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 16px;
        }
        .rb-controls button {
          padding: 6px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
        }
        .rb-controls button:hover:not(:disabled) {
          background: #eee;
        }
        .rb-controls button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .rb-legend {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-top: 14px;
          flex-wrap: wrap;
          font-size: 12px;
        }
        .rb-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .rb-legend-swatch {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }
      `}</style>
      <div class="rb-container">
        <div class="rb-step-title">{step().title}</div>
        <div class="rb-step-counter">
          Step {stepIndex() + 1} of {STEPS.length}
        </div>
        <div class="rb-description">{step().description}</div>

        {/* Side-by-side code */}
        <div class="rb-code-columns">
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

        {/* Ring + atomic counter */}
        <div class="rb-mid-row">
          <div class="rb-ring">
            <For each={Array.from({ length: CAPACITY }, (_, i) => i)}>
              {(i) => {
                const pos = slotPos(i);
                return (
                  <div
                    class="rb-slot"
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
                  class="rb-marker"
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
                  class="rb-marker"
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

          {/* Atomic ops counter */}
          <div class="rb-atomic-panel">
            <div class="rb-atomic-row">
              <span class="rb-atomic-label">Atomic loads</span>
              <span class="rb-atomic-val" style={{ color: '#8e44ad' }}>{step().atomicLoads}</span>
            </div>
            <div class="rb-atomic-row">
              <span class="rb-atomic-label">Atomic stores</span>
              <span class="rb-atomic-val" style={{ color: '#e67e22' }}>{step().atomicStores}</span>
            </div>
            <div class="rb-atomic-row rb-atomic-total">
              <span class="rb-atomic-label" style={{ 'font-weight': 'bold' }}>Total</span>
              <span class="rb-atomic-val" style={{ color: '#e74c3c' }}>
                {step().atomicLoads + step().atomicStores}
              </span>
            </div>
          </div>
        </div>

        <div class="rb-controls">
          <button onClick={prev} disabled={stepIndex() === 0}>
            &#x25C0; Prev
          </button>
          <button onClick={next} disabled={stepIndex() === STEPS.length - 1}>
            Next &#x25B6;
          </button>
          <button onClick={() => setStepIndex(0)}>Reset</button>
        </div>

        <div class="rb-legend">
          <div class="rb-legend-item">
            <div class="rb-legend-swatch" style={{ background: '#ddd' }} />
            Empty
          </div>
          <div class="rb-legend-item">
            <div class="rb-legend-swatch" style={{ background: '#3498db' }} />
            Filled
          </div>
          <div class="rb-legend-item">
            <div class="rb-legend-swatch" style={{ background: '#e67e22' }} />
            Writing
          </div>
          <div class="rb-legend-item">
            <div class="rb-legend-swatch" style={{ background: '#27ae60' }} />
            Reading
          </div>
        </div>
      </div>
    </>
  );
}
