/**
 * File: themeSlice.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines action which enables toggling the current theme.
 * 
 */

// import redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import default state
import defaultState from "./defaultState";

// helper object for inverting color theme
const themeInverter: { [index: string]: string } = {

    dark: "light",
    light: "dark"
}

export default createSlice({

    name: "theme",
    initialState: defaultState.theme,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        setTheme: (_, { payload: theme }: PayloadAction<typeof defaultState.theme>) => theme, 
        toggleTheme: (state) => themeInverter[state],
    }
});