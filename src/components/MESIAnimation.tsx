import { createSignal, For, Show } from 'solid-js';

type MESIState = 'M' | 'E' | 'S' | 'I';

type CacheLine = {
  state: MESIState;
  value: string;
};

type Step = {
  title: string;
  description: string;
  writerLine: number | null;
  readerLine: number | null;
  writer: { shared: CacheLine; ready: CacheLine };
  reader: { shared: CacheLine; ready: CacheLine };
  dram: { shared: string; ready: string; sharedStale: boolean; readyStale: boolean };
  transfer?: { from: 'dram' | 'writer' | 'reader'; to: 'dram' | 'writer' | 'reader'; line: 'shared' | 'ready'; label: string };
};

const CODE_LINES = [
  'volatile long long shared = 0;',
  'atomic_bool ready = 0;',
  '',
  'void *writer(void *_) {',
  '    shared = 0xDEADBEEFCAFEBABE;',
  '    atomic_store_explicit(',
  '        &ready, 1, release);',
  '    return NULL;',
  '}',
  '',
  'void *reader(void *_) {',
  '    while (!atomic_load_explicit(',
  '        &ready, acquire));',
  '    printf("0x%llX\\n", shared);',
  '    return NULL;',
  '}',
];

const I_LINE: CacheLine = { state: 'I', value: '-' };

const STEPS: Step[] = [
  {
    title: 'Initial state',
    description: 'Both shared and ready live in DRAM, initialised to 0. Neither core has cached either line yet.',
    writerLine: null,
    readerLine: null,
    writer: { shared: { ...I_LINE }, ready: { ...I_LINE } },
    reader: { shared: { ...I_LINE }, ready: { ...I_LINE } },
    dram: { shared: '0x0', ready: '0', sharedStale: false, readyStale: false },
  },
  {
    title: 'Reader spins on ready',
    description: 'The reader fetches ready from DRAM. No other core has it, so it enters Exclusive. Value is 0 — loop continues.',
    writerLine: null,
    readerLine: 11,
    writer: { shared: { ...I_LINE }, ready: { ...I_LINE } },
    reader: { shared: { ...I_LINE }, ready: { state: 'E', value: '0' } },
    dram: { shared: '0x0', ready: '0', sharedStale: false, readyStale: false },
    transfer: { from: 'dram', to: 'reader', line: 'ready', label: 'fetch' },
  },
  {
    title: 'Writer stores shared',
    description: 'Writer fetches shared from DRAM (Exclusive), writes 0xDEADBEEFCAFEBABE. Line goes Modified. DRAM is stale.',
    writerLine: 4,
    readerLine: 11,
    writer: { shared: { state: 'M', value: '0xDEAD..BABE' }, ready: { ...I_LINE } },
    reader: { shared: { ...I_LINE }, ready: { state: 'E', value: '0' } },
    dram: { shared: '0x0', ready: '0', sharedStale: true, readyStale: false },
    transfer: { from: 'dram', to: 'writer', line: 'shared', label: 'fetch + write' },
  },
  {
    title: 'Writer stores ready = 1 (release)',
    description: 'Writer needs ready, but reader holds it Exclusive. Invalidation sent — reader\'s copy goes Invalid. Writer writes 1 (Modified). Release guarantees shared is visible first.',
    writerLine: 5,
    readerLine: 11,
    writer: { shared: { state: 'M', value: '0xDEAD..BABE' }, ready: { state: 'M', value: '1' } },
    reader: { shared: { ...I_LINE }, ready: { ...I_LINE } },
    dram: { shared: '0x0', ready: '0', sharedStale: true, readyStale: true },
    transfer: { from: 'writer', to: 'reader', line: 'ready', label: 'invalidate' },
  },
  {
    title: 'Reader sees ready = 1 (acquire)',
    description: 'Reader\'s copy is Invalid. Snoops Modified line from writer\'s L1 — core-to-core, no DRAM. Gets 1, loop exits. Acquire guarantees subsequent reads see the writer\'s stores.',
    writerLine: null,
    readerLine: 11,
    writer: { shared: { state: 'M', value: '0xDEAD..BABE' }, ready: { state: 'S', value: '1' } },
    reader: { shared: { ...I_LINE }, ready: { state: 'S', value: '1' } },
    dram: { shared: '0x0', ready: '1', sharedStale: true, readyStale: false },
    transfer: { from: 'writer', to: 'reader', line: 'ready', label: 'snoop' },
  },
  {
    title: 'Reader loads shared',
    description: 'Reader snoops shared from writer\'s L1. Core-to-core transfer. Gets 0xDEADBEEFCAFEBABE. DRAM was only touched at startup — everything since was cache-to-cache.',
    writerLine: null,
    readerLine: 13,
    writer: { shared: { state: 'S', value: '0xDEAD..BABE' }, ready: { state: 'S', value: '1' } },
    reader: { shared: { state: 'S', value: '0xDEAD..BABE' }, ready: { state: 'S', value: '1' } },
    dram: { shared: '0xDEAD..BABE', ready: '1', sharedStale: false, readyStale: false },
    transfer: { from: 'writer', to: 'reader', line: 'shared', label: 'snoop' },
  },
];

const STATE_COLORS: Record<MESIState, string> = {
  M: '#e74c3c',
  E: '#3498db',
  S: '#2ecc71',
  I: '#95a5a6',
};

const STATE_LABELS: Record<MESIState, string> = {
  M: 'Modified',
  E: 'Exclusive',
  S: 'Shared',
  I: 'Invalid',
};

function CacheLineRow(props: { name: string; line: CacheLine; highlight: boolean }) {
  const color = () => STATE_COLORS[props.line.state];
  return (
    <div
      style={{
        display: 'flex',
        'align-items': 'center',
        gap: '6px',
        padding: '2px 6px',
        'border-radius': '4px',
        background: props.highlight ? '#fff3cd' : 'transparent',
        transition: 'background 0.3s ease',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '18px',
          'text-align': 'center',
          padding: '1px 0',
          'border-radius': '3px',
          background: color(),
          color: '#fff',
          'font-weight': 'bold',
          'font-size': '10px',
          transition: 'background 0.4s ease',
        }}
      >
        {props.line.state}
      </span>
      <span style={{ 'font-family': 'monospace', 'font-size': '11px', 'min-width': '44px' }}>
        {props.name}
      </span>
      <span
        style={{
          'font-family': 'monospace',
          'font-size': '11px',
          color: props.line.state === 'I' ? '#aaa' : '#333',
        }}
      >
        {props.line.value}
      </span>
    </div>
  );
}

export default function MESIAnimation() {
  const [stepIndex, setStepIndex] = createSignal(0);
  const step = () => STEPS[stepIndex()];

  const prev = () => setStepIndex((i) => Math.max(0, i - 1));
  const next = () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));

  const transferLabel = () => {
    const t = step().transfer;
    if (!t) return null;
    if (t.from === 'dram' || t.to === 'dram') return null;
    return t;
  };

  const dramTransfer = () => {
    const t = step().transfer;
    if (!t) return null;
    if (t.from === 'dram' || t.to === 'dram') return t;
    return null;
  };

  return (
    <>
      <style>{`
        .mesi-container {
          font-family: system-ui, -apple-system, sans-serif;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin: 24px auto;
          background: #fafafa;
          max-width: 760px;
        }
        .mesi-header {
          margin-bottom: 10px;
        }
        .mesi-step-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        .mesi-step-counter {
          font-size: 12px;
          color: #888;
        }
        .mesi-description {
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 12px;
          color: #333;
          min-height: 3em;
        }
        .mesi-body {
          display: flex;
          gap: 14px;
          margin-bottom: 12px;
        }
        @media (max-width: 600px) {
          .mesi-body {
            flex-direction: column;
          }
        }
        .mesi-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 10px;
          line-height: 1.45;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          padding: 8px;
          overflow-x: auto;
          flex: 1;
          min-width: 0;
        }
        .mesi-code-line {
          padding: 0 3px;
          white-space: pre;
        }
        .mesi-code-line.writer-highlight {
          background: rgba(231, 76, 60, 0.3);
          border-left: 2px solid #e74c3c;
        }
        .mesi-code-line.reader-highlight {
          background: rgba(52, 152, 219, 0.3);
          border-left: 2px solid #3498db;
        }
        .mesi-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          min-width: 340px;
        }
        .mesi-cores {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .mesi-core {
          border: 2px solid #555;
          border-radius: 6px;
          padding: 6px 8px;
          background: #fff;
          min-width: 130px;
        }
        .mesi-core-label {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 4px;
          text-align: center;
        }
        .mesi-transfer-area {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: 60px;
          min-height: 40px;
          gap: 2px;
        }
        .mesi-transfer-label {
          font-size: 10px;
          color: #e67e22;
          font-weight: bold;
        }
        .mesi-transfer-arrow {
          font-size: 16px;
          color: #e67e22;
        }
        .mesi-transfer-arrow.invalidate {
          color: #e74c3c;
        }
        .mesi-dram {
          border: 2px solid #8e44ad;
          border-radius: 6px;
          padding: 4px 14px;
          background: #f5eef8;
          text-align: center;
          transition: all 0.3s ease;
        }
        .mesi-dram-title {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 2px;
        }
        .mesi-dram-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          font-family: monospace;
          font-size: 11px;
        }
        .mesi-dram-val.stale {
          color: #e67e22;
          text-decoration: line-through;
        }
        .mesi-dram-fetch {
          font-size: 11px;
          color: #8e44ad;
          font-weight: bold;
          min-height: 16px;
        }
        .mesi-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 10px;
        }
        .mesi-controls button {
          padding: 4px 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
        }
        .mesi-controls button:hover:not(:disabled) {
          background: #eee;
        }
        .mesi-controls button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .mesi-legend {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .mesi-legend-item {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
        }
        .mesi-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      `}</style>
      <div class="mesi-container">
        <div class="mesi-header">
          <div class="mesi-step-title">{step().title}</div>
          <div class="mesi-step-counter">Step {stepIndex() + 1} of {STEPS.length}</div>
        </div>
        <div class="mesi-description">{step().description}</div>

        {/* Code + diagram side by side */}
        <div class="mesi-body">
          <div class="mesi-code">
            <For each={CODE_LINES}>
              {(line, i) => {
                const lineNum = i();
                const isWriter = () => step().writerLine === lineNum;
                const isReader = () => step().readerLine === lineNum;
                return (
                  <div
                    class={`mesi-code-line ${isWriter() ? 'writer-highlight' : ''} ${isReader() ? 'reader-highlight' : ''}`}
                  >
                    {line || ' '}
                  </div>
                );
              }}
            </For>
          </div>

          <div class="mesi-diagram">
            {/* Cores + transfer arrow */}
            <div class="mesi-cores">
              <div class="mesi-core" style={{ 'border-color': '#e74c3c' }}>
                <div class="mesi-core-label" style={{ color: '#e74c3c' }}>Writer L1</div>
                <CacheLineRow
                  name="shared"
                  line={step().writer.shared}
                  highlight={!!step().transfer && step().transfer!.line === 'shared' && (step().transfer!.from === 'writer' || step().transfer!.to === 'writer')}
                />
                <CacheLineRow
                  name="ready"
                  line={step().writer.ready}
                  highlight={!!step().transfer && step().transfer!.line === 'ready' && (step().transfer!.from === 'writer' || step().transfer!.to === 'writer')}
                />
              </div>

              <div class="mesi-transfer-area">
                <Show when={transferLabel()}>
                  {(t) => (
                    <>
                      <span class="mesi-transfer-label">{t().line}</span>
                      <span class={`mesi-transfer-arrow ${t().label === 'invalidate' ? 'invalidate' : ''}`}>
                        {t().from === 'writer' ? '\u27A1' : '\u2B05'}
                      </span>
                      <span class="mesi-transfer-label">{t().label}</span>
                    </>
                  )}
                </Show>
              </div>

              <div class="mesi-core" style={{ 'border-color': '#3498db' }}>
                <div class="mesi-core-label" style={{ color: '#3498db' }}>Reader L1</div>
                <CacheLineRow
                  name="shared"
                  line={step().reader.shared}
                  highlight={!!step().transfer && step().transfer!.line === 'shared' && (step().transfer!.from === 'reader' || step().transfer!.to === 'reader')}
                />
                <CacheLineRow
                  name="ready"
                  line={step().reader.ready}
                  highlight={!!step().transfer && step().transfer!.line === 'ready' && (step().transfer!.from === 'reader' || step().transfer!.to === 'reader')}
                />
              </div>
            </div>

            {/* DRAM fetch label */}
            <div class="mesi-dram-fetch">
              <Show when={dramTransfer()}>
                {(t) => (
                  <span>
                    {t().to === 'dram' ? '\u2B07' : '\u2B06'} {t().label} ({t().line})
                  </span>
                )}
              </Show>
            </div>

            {/* DRAM */}
            <div class="mesi-dram">
              <div class="mesi-dram-title">DRAM</div>
              <div class="mesi-dram-row">
                <span class={`mesi-dram-val ${step().dram.sharedStale ? 'stale' : ''}`}>
                  shared={step().dram.shared}
                </span>
                <span class={`mesi-dram-val ${step().dram.readyStale ? 'stale' : ''}`}>
                  ready={step().dram.ready}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mesi-controls">
          <button onClick={prev} disabled={stepIndex() === 0}>
            &#x25C0; Prev
          </button>
          <button onClick={next} disabled={stepIndex() === STEPS.length - 1}>
            Next &#x25B6;
          </button>
          <button onClick={() => setStepIndex(0)}>Reset</button>
        </div>

        <div class="mesi-legend">
          <For each={(['M', 'E', 'S', 'I'] as MESIState[])}>
            {(s) => (
              <div class="mesi-legend-item">
                <div class="mesi-legend-dot" style={{ background: STATE_COLORS[s] }} />
                {STATE_LABELS[s]}
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
}
