/**
 * File: langSlice.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description: 
 * 
 */

// import redux toolkit
import { createSlice } from "@reduxjs/toolkit";

// import languages
import languages from "../../lang/all";

export default createSlice({

    name: "lang",
    initialState: null, // inherit initial state from store

    reducers: {

        // safe to mutate state thanks to redux toolkit

        "setLanguage": (state, action) => { state.data = languages[action.payload]; }
    }
});