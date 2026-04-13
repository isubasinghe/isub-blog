import { createSignal, onMount, onCleanup } from 'solid-js';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type ClockProps = {
  id: number;
  colour: string;
  deltas: Record<number, number>;
  dispatch: (action: { type: string; id?: number; delta?: number }) => void;
};

export default function Clock(props: ClockProps) {
  const interval = randomIntFromInterval(500, 1200);
  const [counter, setCounter] = createSignal(0);
  const [deltaLocal, setDeltaLocal] = createSignal(0);

  onMount(() => {
    props.dispatch({ type: 'UPDATE_DELTA', id: props.id, delta: 0 });

    const tickId = setInterval(() => {
      const delta = props.deltas[props.id];
      if (delta !== undefined && delta !== 0) {
        setCounter((c) => c + delta);
        setDeltaLocal(delta);
        setTimeout(() => setDeltaLocal(0), 300);
        props.dispatch({ type: 'RESET_DELTA', id: props.id });
      }
      setCounter((c) => c + 1);
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
        <div class={`circle_${props.colour}`}>{counter()}</div>
        {deltaLocal() !== 0 && <div class="delta_local">{showText()}</div>}
      </div>
    </>
  );
}
