import { createSignal, onMount, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';
import Clock from './Clock.tsx';
import { computeBerkeleyDeltas } from '../../lib/clock/berkeley';

type State = {
  counters: Record<number, number>;
  deltas: Record<number, number>;
};

const SLAVE_IDS = [1, 2, 3];
const MASTER_ID = 0;
const ALL_IDS = [MASTER_ID, ...SLAVE_IDS];
const SYNC_INTERVAL_MS = 5000;

export default function BerkeleyClockSync() {
  const [state, setState] = createStore<State>({ counters: {}, deltas: {} });
  const [syncing, setSyncing] = createSignal(false);

  const dispatch = (action: {
    type: string;
    id?: number;
    delta?: number;
    value?: number;
  }) => {
    switch (action.type) {
      case 'UPDATE_DELTA':
        setState('deltas', action.id!, action.delta!);
        break;
      case 'RESET_DELTA':
        setState('deltas', action.id!, 0);
        break;
      case 'REPORT_COUNTER':
        setState('counters', action.id!, action.value!);
        break;
      case 'START_SYNC': {
        const allReported = ALL_IDS.every((id) => state.counters[id] !== undefined);
        if (!allReported) break;
        const deltas = computeBerkeleyDeltas({ ...state.counters });
        for (const id of ALL_IDS) {
          setState('deltas', id, deltas[id] ?? 0);
        }
        setSyncing(true);
        setTimeout(() => setSyncing(false), 300);
        break;
      }
    }
  };

  onMount(() => {
    const syncId = setInterval(() => dispatch({ type: 'START_SYNC' }), SYNC_INTERVAL_MS);
    onCleanup(() => clearInterval(syncId));
  });

  return (
    <>
      <style>{`
        .master {
          display: flex;
          justify-content: center;
          width: 500px;
          margin-bottom: 100px;
        }
        .clocks {
          display: flex;
          justify-content: space-between;
          width: 500px;
        }
      `}</style>
      <div class="master">
        <Clock
          id={MASTER_ID}
          colour="red"
          deltas={state.deltas}
          syncing={syncing()}
          dispatch={dispatch}
        />
      </div>
      <div class="clocks">
        <Clock id={1} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
        <Clock id={2} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
        <Clock id={3} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
      </div>
    </>
  );
}
