/**
 * File: state.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: 
 * 
 */

// import dependencies
import { configureStore } from "@reduxjs/toolkit"

// import default state
import defaultState from "./defaultState";

// import slices
import simSlice from "./simSlice";
import langSlice from "./langSlice";
import controlsSlice from "./controlsSlice";

const reduxStateStore = configureStore({
    // merge slices into a root reducer
    reducer: { sim: simSlice.reducer, lang: langSlice.reducer, controls: controlsSlice.reducer },
    // enable extension for debugging
    devTools: true,
    // load default state
    preloadedState: defaultState
});

export { reduxStateStore };