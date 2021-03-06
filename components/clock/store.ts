import React, { createContext } from "react";
import { Actions } from "./reducer";

export type initialStateType = {
    deltas: Record<number, number>
}
export const initialState: initialStateType = {
    deltas: {}
};

export const ClocksContext = createContext<{
    state: initialStateType,
    dispatch: React.Dispatch<Actions>
}>({state: initialState, dispatch: () => {}});
