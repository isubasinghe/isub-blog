
import produce from "immer"
import { initialStateType } from "./store";

export type Actions
    = {type: "UPDATE_DELTA", id: number, delta: number}
    | { type: "RESET_DELTA", id: number};

export const reducer = (state: initialStateType, action: Actions): initialStateType => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "UPDATE_DELTA":
                draft.deltas[action.id] = action.delta;
                break;
            case "RESET_DELTA":
                draft.deltas[action.id] = 0;
                break;
        }
    });
};
