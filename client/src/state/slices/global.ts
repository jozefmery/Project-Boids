/**
 * File: state/slices/global.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines mutators for app wide state.
 * 
 */

// import redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import enums
import { ColorTheme } from "../../stylers";

// import default state
import defaultState from "../default";

// helper object for inverting color theme
const themeInverter = {

    [ColorTheme.DARK]: ColorTheme.LIGHT,
    [ColorTheme.LIGHT]: ColorTheme.DARK
}

// create shorthand
const global = defaultState.global;

const globalSlice = createSlice({

    name: "global",
    initialState: global,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setGlobals: (_, { payload: globals }: PayloadAction<typeof global>) => globals,

        // theme
        setTheme: (state, { payload: theme }: PayloadAction<typeof global.theme>) => { 
            
            state.theme = theme; 
        }, 

        toggleTheme: (state) => { 
            
            state.theme = themeInverter[state.theme];
        },

        // language
        setLanguage: (state, { payload: language }: PayloadAction<typeof global.language>) => { 
            
            state.language = language;
        },

        // dimensions
        setDimensions: (state, { payload: dimensions }: PayloadAction<typeof global.dimensions>) => { 
            
            state.dimensions = dimensions; 
        },

        // side panel

        openSidePanel: (state, { payload: panel }: PayloadAction<typeof global.sidePanel>) => { 
            
            state.sidePanel = panel; 
        },

        toggleStatsOpen: (state) => { 
            
            state.sidePanel = state.sidePanel === "stats" ? "none" : "stats";
        },

        toggleSimSetupOpen: (state) => { 
            
            state.sidePanel = state.sidePanel === "setup" ? "none" : "setup";
        },

        toggleAboutOpen: (state) => { 
            
            state.sidePanel = state.sidePanel === "about" ? "none" : "about";
        },
    }
});

export const {

    setGlobals,
    setTheme,
    toggleTheme,
    setLanguage,
    setDimensions,
    toggleStatsOpen,
    toggleSimSetupOpen,
    toggleAboutOpen,
    openSidePanel

} = globalSlice.actions;

export default globalSlice.reducer;