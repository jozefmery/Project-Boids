import { SET_PREYS } from "../actions/types";

const initialState = {

    preys: [],
    predators: [],

};

export default (state = initialState, action) => {

    switch(action.type) {

        case SET_PREYS:

            return {

                ...state,
                preys: action.payload
            };

        default:

            return state;
    }
}