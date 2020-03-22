/**
 * File: simSlice.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines various actions for manipulating the state of the simulation.
 * 
 */

// import redux toolkit
import { createSlice } from "@reduxjs/toolkit";

// import default state
import defaultState from "./defaultState";

export default createSlice({

    name: "sim",
    initialState: defaultState.sim,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setSimSettings: (_, { payload: state }) => state,
        
        // running
        setSimRunning: (state, { payload: running }) => { state.running = running; },
        toggleSimRunning: (state, _) => { state.running = !state.running; },
        
        // area
        setSimArea: (state, { payload: area }) => { state.area = area; },

        // camera
        setCameraSettings: (state, { payload: camera }) => { state.camera = camera; },
        
        setCameraMinScale: (state, { payload: min }) => { state.camera.scale.min = min; },                                  
        setCameraMaxScale: (state, { payload: max }) => { state.camera.scale.max = max; },                                  
        setCameraScaleDelta: (state, { payload: delta }) => { state.camera.scale.delta = delta; },

        setCameraMoveDelta: (state, { payload: delta }) => { state.camera.moveDelta = delta; },
                                    
        // grid
        setGridSettings: (state, { payload: grid }) => { state.grid = grid; },
        setGridDraw: (state, { payload: draw }) => { state.grid.draw = draw; },
        toggleGridDraw: (state, _) => { state.grid.draw = !state.grid.draw; },
        setGridIntensity: (state, { payload: intensity }) => { state.grid.intensity = intensity; },
        setGridHighlight: (state, { payload: highlight }) => { state.grid.highlight = highlight; },        
    }
});