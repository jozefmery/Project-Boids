/**
 * File: simSlice.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines various actions for manipulating the state of the simulation.
 * 
 */

// import redux toolkit
import { createSlice } from "@reduxjs/toolkit";

// import utilities
import { Clamp } from "../../utils";

export default createSlice({

    name: "sim",
    initialState: null, // inherit initial state from store
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // entities
        
        // running
        "setSimRunning": (state, action) => { state.running = action.payload; },
        "toggleSimRunning": (state, _) => { state.running = !state.running; },
        
        // area
        "setSimArea": (state, action) => { state.area = action.payload; },

        // camera
        "setCameraSettings": (state, action) => { state.camera = action.payload; },
        "setCameraTarget": (state, action) => { state.camera.target = action.payload; },
        "moveCamera": (state, action) => {  state.camera.target.x += action.payload.x;
                                            state.camera.target.y += action.payload.y;
                                            },
        "setCameraScaleSettings": (state, action) => { state.camera.scale = action.payload; },
        "setCameraMinScale": (state, action) => { state.camera.scale.min = action.payload; },                                  
        "setCameraMaxScale": (state, action) => { state.camera.scale.max = action.payload; },                                  
        "setCameraCurrentScale": (state, action) => { state.camera.scale.current = Clamp(action.payload, state.camera.scale.min, state.camera.scale.max); },                                  
        "changeCameraCurrentScale": (state, action) => { state.camera.scale.current = 
                                                            Clamp(state.camera.scale.current + action.payload, state.camera.scale.min, state.camera.scale.max); 
                                                        },                                  
        "setCameraScaleFactor": (state, action) => { state.camera.scale.factor = action.payload; },
        
        // grid
        "setGridSettings": (state, action) => { state.grid = action.payload; },
        "setGridDraw": (state, action) => { state.grid.draw = action.payload; },
        "setGridIntensity": (state, action) => { state.grid.intensity = action.payload; },
        "setGridHighLight": (state, action) => { state.grid.highLight = action.payload; },        
    }
});