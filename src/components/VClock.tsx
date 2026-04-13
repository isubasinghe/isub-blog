import { createStore } from 'solid-js/store';
import { For, Show } from 'solid-js';

type Value = {
  counter: number;
  state: number;
};

function createVClock(id: number, initial: number) {
  const [clocks, setClocks] = createStore<Record<number, Value>>({
    [id]: { state: initial, counter: 0 },
  });

  const updateSelf = (newState: number) => {
    setClocks(id, { state: newState, counter: (clocks[id]?.counter ?? 0) + 1 });
  };

  const receiveUpdate = (_newState: number, _vclocks: Record<number, Value>) => {
    // placeholder for receive logic
  };

  const sendUpdate = (receiveFn: Function) => {
    setClocks(id, 'counter', (c) => c + 1);
    receiveFn(clocks[id].state, { ...clocks });
  };

  return { clocks, updateSelf, receiveUpdate, sendUpdate };
}

export default function VClockMan() {
  const clock0 = createVClock(0, 0);
  const clock1 = createVClock(1, 0);

  const getAdder = (clockRef: typeof clock0, id: number) => {
    return () => clockRef.updateSelf(clockRef.clocks[id].state + 1);
  };

  const getMinus = (clockRef: typeof clock0, id: number) => {
    return () => clockRef.updateSelf(clockRef.clocks[id].state - 1);
  };

  return (
    <Show when={clock0.clocks[0] && clock1.clocks[1]}>
      <style>{`
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
        .buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `}</style>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <For each={Object.keys(clock0.clocks)}>{(k) =>
              <th>V[{k}]</th>
            }</For>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{clock0.clocks[0].state}</td>
            <For each={Object.keys(clock0.clocks)}>{(k) =>
              <td>{clock0.clocks[Number(k)].counter}</td>
            }</For>
          </tr>
        </tbody>
      </table>

      <div class="buttons">
        <button onClick={getAdder(clock0, 0)}>Add One</button>
        <button onClick={getMinus(clock0, 0)}>Minus One</button>
        <button onClick={() => clock0.sendUpdate(clock1.receiveUpdate)}>
          Send to other
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <For each={Object.keys(clock1.clocks)}>{(k) =>
              <th>V[{k}]</th>
            }</For>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{clock1.clocks[1].state}</td>
            <For each={Object.keys(clock1.clocks)}>{(k) =>
              <td>{clock1.clocks[Number(k)].counter}</td>
            }</For>
          </tr>
        </tbody>
      </table>

      <div class="buttons">
        <button onClick={getAdder(clock1, 1)}>Add One</button>
        <button onClick={getMinus(clock1, 1)}>Minus One</button>
        <button onClick={() => clock1.sendUpdate(clock0.receiveUpdate)}>
          Send to other
        </button>
      </div>
    </Show>
  );
}
