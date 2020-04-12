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

// import reducers
import sim from "./simSlice";
import language from "./languageSlice";
import theme from "./themeSlice";
import keyboard from "./keyboardSlice";

const reduxStateStore = configureStore({
    
    // merge slice reducers into a root reducer
    reducer: { sim, language, theme, keyboard },
    // enable extension for debugging
    devTools: true,
    // load default state
    preloadedState: defaultState
});

export { reduxStateStore };