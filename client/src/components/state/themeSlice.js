/**
 * File: themeSlice.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: 
 * 
 */

// import redux toolkit
import { createSlice } from "@reduxjs/toolkit";

// helper object for inverting color theme
const themeInverter = {

    dark: "light",
    light: "dark"
}

export default createSlice({

    name: "theme",
    initialState: null, // inherit initial state from store

    reducers: {

        // safe to mutate state thanks to redux toolkit

        "toggleTheme": (state, _) => themeInverter[state],
    }
});