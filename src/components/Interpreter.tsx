import { createSignal, onMount } from 'solid-js';

declare global {
  interface Window {
    parseScheme?: (input: string) => Promise<string>;
  }
}

export default function Interpreter() {
  const [output, setOutput] = createSignal('');
  const [input, setInput] = createSignal('');

  const handleInput = (value: string) => {
    if (window.parseScheme) {
      setInput(value);
      window.parseScheme(value).then(setOutput);
    } else {
      setInput('');
      setOutput('wasm not loaded yet');
    }
  };

  onMount(() => {
    const script = document.createElement('script');
    script.src = '/ischeme-wasm.js';
    script.onload = () => {
      handleInput('(+ 1 2)');
    };
    document.head.appendChild(script);
  });

  return (
    <>
      <textarea
        value={input()}
        onInput={(e) => handleInput(e.currentTarget.value)}
      />
      <p />
      <textarea class="output-area" value={output()} readOnly />
      <style>{`
        textarea {
          max-width: 90%;
          width: 750px;
          height: 200px;
        }
        .output-area {
          border: none;
          resize: none;
        }
        .output-area:focus {
          outline: none;
        }
      `}</style>
    </>
  );
}
