import produce from "immer";
import React, { useLayoutEffect, useState } from "react";

type useVClockI = {
  id: number;
  initial: any;
};

type Value = {
  counter: number;
  state: any;
};

const useVClock = ({ id, initial }: useVClockI) => {
  const [clocks, setClocks] = useState<Record<number, Value> | null>(null);

  useLayoutEffect(() => {
    setClocks((old) =>
      produce(old, (draft) => {
        if (draft === null) {
          draft = {};
        }
        draft[id] = { state: initial, counter: 0 };
        return draft;
      })
    );
  }, [id, initial]);

  const updateSelf = (newState: any) => {
    setClocks((old) =>
      produce(old, (draft) => {
        if (draft === null) {
          draft = {};
        }
        const { counter = 0 } = draft[id];
        draft[id] = { state: newState, counter: counter + 1 };
        return draft;
      })
    );
  };

  const receiveUpdate = (newState: any, vclocks: Record<number, Value>) => {
    setClocks((old) =>
      produce(old, (draft) => {
        return draft;
      })
    );
  };

  const sendUpdate = (receiveFn: Function) => {
    setClocks((old) =>
      produce(old, (draft) => {
        draft[id].counter += 1;
        return draft;
      })
    );
    receiveFn(clocks[id].state, clocks);
  };
  let state = null;
  if (clocks !== null) {
    state = clocks[id];
  }

  return { state, clocks, updateSelf, receiveUpdate, sendUpdate };
};

const VClockMan = () => {
  const { state, clocks, updateSelf, receiveUpdate, sendUpdate } = useVClock({
    id: 0,
    initial: 0,
  });

  const {
    state: state1,
    clocks: clocks1,
    updateSelf: updateSelf1,
    receiveUpdate: receiveUpdate1,
  } = useVClock({
    id: 1,
    initial: 0,
  });

  const getAdder = (currState, updateFn) => {
    return () => {
      updateFn(currState.state + 1);
    };
  };

  const getMinus = (currState, updateFn) => {
    return () => {
      updateFn(currState.state - 1);
    };
  };

  const getSender = (sender, receiver) => {
    return () => sender(receiver);
  };

  return (
    <>
      {state && state1 && (
        <>
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
              {Object.keys(clocks).map((k) => {
                return <th>V[{k}]</th>;
              })}
            </tr>
            <tr>
              <td>{state.state}</td>
              {Object.keys(clocks).map((k) => {
                console.log(clocks[k]);
                return <td>{clocks[k].counter}</td>;
              })}
            </tr>
          </table>

          <div className="buttons">
            <button onClick={getAdder(state, updateSelf)}>Add One</button>
            <button onClick={getMinus(state, updateSelf)}>Minus One</button>
            <button onClick={getSender(sendUpdate, receiveUpdate1)}>
              Send to other
            </button>
          </div>

          <table>
            <tr>
              <th>State</th>
              {Object.keys(clocks1).map((k) => {
                return <th>V[{k}]</th>;
              })}
            </tr>
            <tr>
              <td>{state1.state}</td>
              {Object.keys(clocks1).map((k) => {
                console.log(clocks1[k]);
                return <td>{clocks1[k].counter}</td>;
              })}
            </tr>
          </table>
          <div className="buttons">
            <button>Add One</button>
            <button>Minus One</button>
            <button onClick={getMinus(state, updateSelf)}>Send to other</button>
          </div>
        </>
      )}
    </>
  );
};

export default VClockMan;
