import { combineReducers } from "redux";
import simReducer from "./simReducer"

// create root reducer by combining all reducers
export default combineReducers({ simReducer });