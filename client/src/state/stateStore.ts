/**
 * File: stateStore.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines the state store by combining reducers from slices and hydrates 
 *              the state with default values. 
 * 
 */

// import dependencies
import { configureStore } from "@reduxjs/toolkit"

// import default state
import defaultState from "./defaultState";

// import slices
import simSlice from "./simSlice";
import languageSlice from "./languageSlice";
import themeSlice from "./themeSlice";
import keyboardSlice from "./keyboardSlice";

const reduxStateStore = configureStore({
    
    // merge slices into a root reducer
    reducer: {  sim: simSlice.reducer, 
                language: languageSlice.reducer,
                theme: themeSlice.reducer,
                keyboard: keyboardSlice.reducer },

    // enable extension for debugging
    devTools: true,
    // load default state
    preloadedState: defaultState
});

export { reduxStateStore };