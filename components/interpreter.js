import {useState, useLayoutEffect} from "react";
const Interpreter = ({}) => {
  const [output, setOutput] = useState("")
  const [input, setInput] = useState("")
  useLayoutEffect(() => {
    if(window.parseScheme) {
      handleInput({target: {value: "(+ 1 2)"}})
    }
  }, [])
  const handleInput = (ev) => {
    if(window.parseScheme) {
      setInput(ev.target.value)
      window.parseScheme(ev.target.value).then(setOutput)
    }else {
      setInput("")
      setOutput("wasm not loaded yet")
    }
  }
  return (
    <>
      <textarea value={input} onChange={handleInput}/>
      <p />
      <textarea className="output-area" value={output} readOnly />

      <style>{
        `
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
        `
        }</style>
      
    </>
  );
};

export default Interpreter;