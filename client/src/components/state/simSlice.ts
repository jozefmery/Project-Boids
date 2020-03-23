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
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import default state
import defaultState from "./defaultState";

// create shorthand
const simState = defaultState.sim;

export type SimStateShape = typeof simState;

export default createSlice({

    name: "sim",
    initialState: defaultState.sim,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setSimSettings: (_, { payload: state }: PayloadAction<SimStateShape>) => state,
        
        // running
        setSimRunning: (state, { payload: running }: PayloadAction<typeof simState.running>) => 
            { state.running = running; },
        toggleSimRunning: (state) => { state.running = !state.running; },
        
        // area
        setSimArea: (state, { payload: area }: PayloadAction<typeof simState.area>) => { state.area = area; },

        // camera
        setCameraSettings: (state, { payload: camera }: PayloadAction<typeof simState.camera>) => { state.camera = camera; },
        
        setCameraMinScale: (state, { payload: min }: PayloadAction<typeof simState.camera.scale.min>) => 
            { state.camera.scale.min = min; },
        setCameraMaxScale: (state, { payload: max }: PayloadAction<typeof simState.camera.scale.max>) => 
            { state.camera.scale.max = max; },
        setCameraScaleDelta: (state, { payload: delta }: PayloadAction<typeof simState.camera.scale.delta>) => 
            { state.camera.scale.delta = delta; },
        setCameraMoveDelta: (state, { payload: delta }: PayloadAction<typeof simState.camera.moveDelta>) => 
            { state.camera.moveDelta = delta; },
                                    
        // grid
        setGridSettings: (state, { payload: grid }: PayloadAction<typeof simState.grid>) => 
            { state.grid = grid; },

        setGridDraw: (state, { payload: draw }: PayloadAction<typeof simState.grid.draw>) => 
            { state.grid.draw = draw; },
        toggleGridDraw: (state) => 
            { state.grid.draw = !state.grid.draw; },
        setGridIntensity: (state, { payload: intensity }: PayloadAction<typeof simState.grid.intensity>) => 
            { state.grid.intensity = intensity; },
        setGridHighlight: (state, { payload: highlight }: PayloadAction<typeof simState.grid.highlight>) => 
            { state.grid.highlight = highlight; },        
    }
});