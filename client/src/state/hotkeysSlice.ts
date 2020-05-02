/**
 * File: hotkeysSlice.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 1.4.2020
 * License: none
 * Description: Defines actions for changing hotkeys.
 * 
 */

// import redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import default state
import defaultState from "./defaultState";

// import type information
import { Action } from "../actions";
import { ActionHotkeys } from "./types";

type ActionHotkey = NonNullable<ActionHotkeys[Action]>;

// shorthand
const hotkeys = defaultState.hotkeys;

const hotkeysSlice = createSlice({

    name: "hotkeys",
    initialState: hotkeys,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setHotkeys: (_, { payload: settings }: PayloadAction<typeof hotkeys>) => settings,

        setHotkey: (state, { payload }: PayloadAction<{ action: Action, settings: ActionHotkey }>) => {

            state[payload.action] = payload.settings;
        }
    }
});

export const { 
    
    setHotkey,
    setHotkeys

} = hotkeysSlice.actions;

export default hotkeysSlice.reducer;