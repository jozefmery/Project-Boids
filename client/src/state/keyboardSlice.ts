/**
 * File: keyboardSlice.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 1.4.2020
 * License: none
 * Description:
 * 
 */

// import redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import default state and bindings type
import defaultState from "./defaultState";

// import type information
import { Bindings } from "./types";

// shorthand
const keyboard = defaultState.keyboard;

const keyboardSlice = createSlice({

    name: "keyboard",
    initialState: keyboard,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setKeyobardSettings: (_, { payload: settings }: PayloadAction<typeof keyboard>) => settings,

        // bindings
        setKeyBindings: (state, { payload: bindings }: PayloadAction<typeof keyboard.bindings>) => {

            state.bindings = bindings;
        },

        setKeyBinding: (state, { payload }: PayloadAction<{ binding: Bindings, combination: string }>) => {

            state.bindings[payload.binding] = payload.combination;
        }
    }
});

export const { 
    
    setKeyobardSettings,
    setKeyBindings,
    setKeyBinding 

} = keyboardSlice.actions;

export default keyboardSlice.reducer;