/**
 * File: languageSlice.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description: Defines action to manipulate currently selected language.
 * 
 */

// import redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import default state
import defaultState from "./defaultState";

const languageSlice = createSlice({

    name: "language",
    initialState: defaultState.language,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        setLanguage: (_, { payload: language }: PayloadAction<typeof defaultState.language>) => language
    }
});

export const {

    setLanguage

} = languageSlice.actions;

export default languageSlice.reducer;