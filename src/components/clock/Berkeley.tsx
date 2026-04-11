import { createStore } from 'solid-js/store';
import Clock from './Clock.tsx';

type State = {
  deltas: Record<number, number>;
};

export default function BerkeleyClockSync() {
  const [state, setState] = createStore<State>({ deltas: {} });

  const dispatch = (action: { type: string; id?: number; delta?: number }) => {
    switch (action.type) {
      case 'UPDATE_DELTA':
        setState('deltas', action.id!, action.delta!);
        break;
      case 'RESET_DELTA':
        setState('deltas', action.id!, 0);
        break;
    }
  };

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
        <Clock id={0} colour="red" deltas={state.deltas} dispatch={dispatch} />
      </div>
      <div class="clocks">
        <Clock id={1} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
        <Clock id={2} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
        <Clock id={3} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
      </div>
    </>
  );
}
