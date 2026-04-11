import { createStore } from 'solid-js/store';
import { Show } from 'solid-js';

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
        <tr>
          <th>State</th>
          {Object.keys(clock0.clocks).map((k) => (
            <th>V[{k}]</th>
          ))}
        </tr>
        <tr>
          <td>{clock0.clocks[0].state}</td>
          {Object.keys(clock0.clocks).map((k) => (
            <td>{clock0.clocks[Number(k)].counter}</td>
          ))}
        </tr>
      </table>

      <div class="buttons">
        <button onClick={getAdder(clock0, 0)}>Add One</button>
        <button onClick={getMinus(clock0, 0)}>Minus One</button>
        <button onClick={() => clock0.sendUpdate(clock1.receiveUpdate)}>
          Send to other
        </button>
      </div>

      <table>
        <tr>
          <th>State</th>
          {Object.keys(clock1.clocks).map((k) => (
            <th>V[{k}]</th>
          ))}
        </tr>
        <tr>
          <td>{clock1.clocks[1].state}</td>
          {Object.keys(clock1.clocks).map((k) => (
            <td>{clock1.clocks[Number(k)].counter}</td>
          ))}
        </tr>
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
