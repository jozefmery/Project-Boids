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
import defaultState, { Bindings } from "./defaultState";

export default createSlice({

    name: "keyboard",
    initialState: defaultState.keyboard,
    reducers: {

        // safe to mutate state thanks to redux toolkit
        setKeyBinding: (state, { payload }: PayloadAction<{ binding: Bindings, combination: string }>) => {

            state.bindings[payload.binding] = payload.combination;
        }
    }
});