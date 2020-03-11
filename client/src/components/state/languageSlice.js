/**
 * File: languageSlice.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description: Defines action to manipulate currently selected language.
 * 
 */

// import redux toolkit
import { createSlice } from "@reduxjs/toolkit";

export default createSlice({

    name: "language",
    initialState: null, // inherit initial state from store

    reducers: {

        // safe to mutate state thanks to redux toolkit

        setLanguage: (_, { payload }) => payload
    }
});