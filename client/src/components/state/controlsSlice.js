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

        // set entire controls state
        setControls: (_, { payload: controls }) => controls,

        // keyboard
        setKeys: (state, { payload: keys }) => { state.keys = keys; },
        resetKeys: (state, _) => { 
        
            state.keys = {}; 
            state.mouse.buttons = {}; 
        },

        setKeyPressed: (state, { payload }) => { state.keys[payload.key] = payload.pressed; },

        // mouse
        setMouseButtonPressed: (state, { payload }) => { state.mouse.buttons[payload.button] = payload.pressed }
    }
});