import { createSignal } from 'solid-js';

export default function AtomicOpsCalculator() {
  const [items, setItems] = createSignal(10000);
  const [capacityExp, setCapacityExp] = createSignal(3); // 2^3 = 8

  const capacity = () => Math.pow(2, capacityExp());
  const N = () => items();

  // Uncached: every enqueue loads head + tail (1 cross-core), every dequeue loads tail + head (1 cross-core)
  const uncachedCrossCore = () => 2 * N();
  const uncachedTotal = () => 6 * N(); // 3 atomics per enqueue + 3 per dequeue

  // Cached: cross-core loads only when cache says full/empty
  // Writer hits full path every ~C items, reader hits empty path every ~C items
  const cachedCrossCore = () => 2 * Math.ceil(N() / capacity());
  const cachedOwnLoads = () => 2 * N(); // 1 own load per enqueue + 1 per dequeue
  const cachedStores = () => 2 * N(); // 1 store per enqueue + 1 per dequeue
  const cachedTotal = () => cachedOwnLoads() + cachedCrossCore() + cachedStores();

  const reduction = () => {
    const uc = uncachedCrossCore();
    if (uc === 0) return 0;
    return ((uc - cachedCrossCore()) / uc * 100);
  };

  const maxBar = () => Math.max(uncachedCrossCore(), 1);

  function fmt(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  return (
    <>
      <style>{`
        .aoc-container {
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
        .aoc-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .aoc-inputs {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .aoc-input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .aoc-input-label {
          font-size: 13px;
          color: #555;
          font-weight: bold;
        }
        .aoc-input-val {
          font-size: 13px;
          color: #888;
          font-family: monospace;
        }
        .aoc-input-group input[type="range"] {
          width: 200px;
          cursor: pointer;
        }
        .aoc-input-group input[type="number"] {
          width: 120px;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          font-family: monospace;
        }
        .aoc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .aoc-table th, .aoc-table td {
          padding: 6px 10px;
          text-align: right;
          border-bottom: 1px solid #eee;
        }
        .aoc-table th {
          text-align: left;
          color: #555;
          font-weight: normal;
        }
        .aoc-table th:first-child {
          width: 50%;
        }
        .aoc-table td {
          font-family: monospace;
          font-weight: bold;
        }
        .aoc-table thead th {
          font-weight: bold;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        .aoc-table .cross-core {
          color: #e74c3c;
        }
        .aoc-bars {
          margin-bottom: 8px;
        }
        .aoc-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .aoc-bar-label {
          font-size: 12px;
          width: 80px;
          text-align: right;
          color: #555;
          flex-shrink: 0;
        }
        .aoc-bar-track {
          flex: 1;
          height: 24px;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .aoc-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          padding-left: 8px;
          font-size: 11px;
          font-weight: bold;
          color: #fff;
          white-space: nowrap;
          min-width: fit-content;
        }
        .aoc-reduction {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          padding: 8px;
          border-radius: 6px;
          background: #e8f8f5;
          color: #1a8a6a;
          border: 1px solid #a3d9cc;
        }
      `}</style>
      <div class="aoc-container">
        <div class="aoc-title">Cross-core atomic load comparison</div>

        <div class="aoc-inputs">
          <div class="aoc-input-group">
            <label class="aoc-input-label">Items transferred (N)</label>
            <input
              type="number"
              min="1"
              max="100000000"
              value={items()}
              onInput={(e) => {
                const v = parseInt(e.currentTarget.value);
                if (!isNaN(v) && v > 0) setItems(v);
              }}
            />
          </div>
          <div class="aoc-input-group">
            <label class="aoc-input-label">Buffer capacity</label>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              prop:value={capacityExp()}
              onInput={(e) => setCapacityExp(parseInt(e.currentTarget.value))}
            />
            <span class="aoc-input-val">
              2<sup>{capacityExp()}</sup> = {capacity()} slots
            </span>
          </div>
        </div>

        <table class="aoc-table">
          <thead>
            <tr>
              <th></th>
              <th>Uncached</th>
              <th>Cached</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Own loads (L1 hit)</th>
              <td>{fmt(2 * N())}</td>
              <td>{fmt(cachedOwnLoads())}</td>
            </tr>
            <tr>
              <th class="cross-core">Cross-core loads (snoop)</th>
              <td class="cross-core">{fmt(uncachedCrossCore())}</td>
              <td class="cross-core">{fmt(cachedCrossCore())}</td>
            </tr>
            <tr>
              <th>Stores</th>
              <td>{fmt(2 * N())}</td>
              <td>{fmt(cachedStores())}</td>
            </tr>
            <tr style={{ 'border-top': '2px solid #ddd' }}>
              <th style={{ 'font-weight': 'bold' }}>Total atomic ops</th>
              <td>{fmt(uncachedTotal())}</td>
              <td>{fmt(cachedTotal())}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ 'font-size': '12px', 'font-weight': 'bold', color: '#555', 'margin-bottom': '6px' }}>
          Cross-core loads (the expensive ones)
        </div>
        <div class="aoc-bars">
          <div class="aoc-bar-row">
            <span class="aoc-bar-label">Uncached</span>
            <div class="aoc-bar-track">
              <div
                class="aoc-bar-fill"
                style={{
                  width: '100%',
                  background: '#e74c3c',
                }}
              >
                {fmt(uncachedCrossCore())}
              </div>
            </div>
          </div>
          <div class="aoc-bar-row">
            <span class="aoc-bar-label">Cached</span>
            <div class="aoc-bar-track">
              <div
                class="aoc-bar-fill"
                style={{
                  width: `${Math.max((cachedCrossCore() / maxBar()) * 100, 2)}%`,
                  background: '#27ae60',
                }}
              >
                {fmt(cachedCrossCore())}
              </div>
            </div>
          </div>
        </div>

        <div class="aoc-reduction">
          {reduction().toFixed(1)}% fewer cross-core loads with caching (capacity = {capacity()})
        </div>
      </div>
    </>
  );
}
