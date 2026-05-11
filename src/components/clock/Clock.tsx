import { createSignal, onMount, onCleanup } from 'solid-js';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type ClockProps = {
  id: number;
  colour: string;
  deltas: Record<number, number>;
  syncing?: boolean;
  dispatch: (action: {
    type: string;
    id?: number;
    delta?: number;
    value?: number;
  }) => void;
};

export default function Clock(props: ClockProps) {
  const interval = randomIntFromInterval(500, 1200);
  const [counter, setCounter] = createSignal(0);
  const [deltaLocal, setDeltaLocal] = createSignal(0);

  onMount(() => {
    props.dispatch({ type: 'UPDATE_DELTA', id: props.id, delta: 0 });
    props.dispatch({ type: 'REPORT_COUNTER', id: props.id, value: 0 });

    const tickId = setInterval(() => {
      const delta = props.deltas[props.id];
      if (delta !== undefined && delta !== 0) {
        setCounter((c) => c + delta);
        setDeltaLocal(delta);
        setTimeout(() => setDeltaLocal(0), 300);
        props.dispatch({ type: 'RESET_DELTA', id: props.id });
      }
      const next = counter() + 1;
      setCounter(next);
      props.dispatch({ type: 'REPORT_COUNTER', id: props.id, value: next });
    }, interval);

    onCleanup(() => clearInterval(tickId));
  });

  const showText = () => {
    const d = deltaLocal();
    return d > 0 ? `+ ${d}` : `${d}`;
  };

  return (
    <>
      <style>{`
        .circle_${props.colour} {
          background: ${props.colour};
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          transition: box-shadow 0.2s ease;
        }
        .circle_${props.colour}.syncing {
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.8),
                      0 0 0 10px rgba(0, 0, 0, 0.4);
        }
        .circle_container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .delta_local {
          margin-left: 20px;
        }
      `}</style>
      <div class="circle_container">
        <div
          class={`circle_${props.colour}${props.syncing ? ' syncing' : ''}`}
        >
          {counter()}
        </div>
        {deltaLocal() !== 0 && <div class="delta_local">{showText()}</div>}
      </div>
    </>
  );
}
