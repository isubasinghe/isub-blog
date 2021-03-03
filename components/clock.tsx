import React, { useState, useLayoutEffect } from "react";
import {useInterval} from 'react-use';

const Clock = ({id, colour}: {id: number, colour: string}) => {
    const [counter, setCounter] = useState(0);

    useInterval(() => {
        setCounter((count) => count + 1);
    }, 1000);

    useLayoutEffect(() => {
        
    }, []);
    return (
        <>
            <style>{`
                .circle {
                    background: ${colour};
                    width: 100px;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;

                }
            `}</style>  
            <div className="circle">{counter}</div>
            
        </>
    )
}

export default React.memo(Clock, () => true);