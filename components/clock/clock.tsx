import React, { useContext, useState, useLayoutEffect } from "react";
import {useInterval} from 'react-use';
import { ClocksContext } from "./store";


const Clock = ({id, colour}: {id: number, colour: string}) => {
    const {state, dispatch } = useContext(ClocksContext);
    const [counter, setCounter] = useState(0);
    const [deltaLocal, setDeltaLocal] = useState(0);

    if (state.deltas[id] !== undefined && state.deltas[id] !== 0) {
        setCounter((count) => count + state.deltas[id]);
        setDeltaLocal(state.deltas[id]);
        setTimeout(() => {
            setDeltaLocal(0);
        }, 300)
        dispatch({type: "RESET_DELTA", id});
    }

    useInterval(() => {
        setCounter((count) => count + 1);
    }, 1000);

    useLayoutEffect(() => {
        dispatch({type: "UPDATE_DELTA", id, delta: 0});
    }, []);

    const showText = deltaLocal > 0 ? `+ ${deltaLocal}` : `${deltaLocal}`;

    return (
        <>
            <style>{`
                .circle_${colour} {
                    background: ${colour};
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
            <div className="circle_container">
                <div className={`circle_${colour}`}>{counter}</div>
                {deltaLocal !== 0 && <div className="delta_local">{showText}</div>}
            </div>
        </>
    )
}

export default React.memo(Clock, () => true);