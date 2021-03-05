import React, {useReducer} from "react";
import dynamic from 'next/dynamic'

const BerkeleyClockSync = dynamic(
    () => import('../components/clock/berkeley'),
    { loading: () => <p>...</p> }
)


const Test = () => {
    
    return (
        <>
            <BerkeleyClockSync />
        </>
    )
};

export default Test;