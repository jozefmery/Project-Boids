import { SET_PREYS } from "./types";

export const setPreys = preys => dispatch => {

    dispatch({ type: SET_PREYS, payload: preys });
};