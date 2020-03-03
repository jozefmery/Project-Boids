/**
 * File: controlsSlice.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: Defines various actions for manipulating the state of controls.
 * 
 */

// import redux toolkit
import { createSlice } from "@reduxjs/toolkit";

export default createSlice({

    name: "controls",
    initialState: null, // inherit initial state from store

    reducers: {

        // safe to mutate state thanks to redux toolkit

        "setControls": (_, action) => action.payload,
        "setKeymap": (state, action) => { state.keyMap = action.payload; },
        "setKeyPressed": (state, action) => { state.keyMap[action.payload.key] = action.payload.pressed; },
    }
});