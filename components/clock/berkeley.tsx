import React, {useReducer} from "react";
import Clock from "./clock";
import { ClocksContext, initialState } from "./store";
import {reducer as clockReducer } from "./reducer";


const BerkeleyClockSync = () => {
    const [state, dispatch] = useReducer(clockReducer, initialState);
    return (
        <ClocksContext.Provider value={{state, dispatch}}>
            <style>{`
                .master {
                    display: flex;
                    justify-content: center;
                    width: 500px;
                    margin-bottom: 100px;
                }
                .clocks {
                    display: flex;
                    justify-content: space-between;
                    width: 500px;
                }

            `}</style>
            <div className="master">
                <Clock id={0} colour="red" />
            </div>
            <div className="clocks">
                <Clock id={1} colour="yellow"/>

                <Clock id={2} colour="yellow"/>

                <Clock id={3} colour="yellow"/>
            </div>
        </ClocksContext.Provider>
    );
}

export default BerkeleyClockSync;
