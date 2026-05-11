import { createStore } from 'solid-js/store';
import { createSignal, For, Show } from 'solid-js';
import { mergeVectorClocks } from '../lib/clock/vector';

type Value = {
  counter: number;
  state: number;
};

function createVClock(id: number, initial: number) {
  const [clocks, setClocks] = createStore<Record<number, Value>>({
    [id]: { state: initial, counter: 0 },
  });
  const [flash, setFlash] = createSignal(false);

  const updateSelf = (newState: number) => {
    setClocks(id, { state: newState, counter: (clocks[id]?.counter ?? 0) + 1 });
  };

  // _newState is intentionally unused: per spec, receiver does not adopt sender's state.
  const receiveUpdate = (_newState: number, vclocks: Record<number, Value>) => {
    // Project the rich store down to a flat vector for the pure merge,
    // then write each component back.
    const selfFlat: Record<number, number> = {};
    for (const k of Object.keys(clocks)) {
      selfFlat[Number(k)] = clocks[Number(k)].counter;
    }
    const receivedFlat: Record<number, number> = {};
    for (const k of Object.keys(vclocks)) {
      receivedFlat[Number(k)] = vclocks[Number(k)].counter;
    }

    const merged = mergeVectorClocks(selfFlat, receivedFlat, id);

    for (const k of Object.keys(merged)) {
      const key = Number(k);
      if (clocks[key]) {
        setClocks(key, 'counter', merged[key]);
      } else {
        setClocks(key, { state: 0, counter: merged[key] });
      }
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 400);
  };

  const sendUpdate = (receiveFn: Function) => {
    setClocks(id, 'counter', (c) => c + 1);
    receiveFn(clocks[id].state, { ...clocks });
  };

  return { id, clocks, flash, updateSelf, receiveUpdate, sendUpdate };
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
          transition: background-color 0.4s ease;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
        tr.flash td {
          background-color: #fff3a3;
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
          <tr class={clock0.flash() ? 'flash' : ''}>
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
          <tr class={clock1.flash() ? 'flash' : ''}>
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
