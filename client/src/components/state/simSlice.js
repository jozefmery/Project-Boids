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

const oppositeDirection = {

    up: "down",
    right: "left",
    down: "up",
    left: "right"
};

export default createSlice({

    name: "sim",
    initialState: null, // inherit initial state from store
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // entities
        
        // running
        setSimRunning: (state, { payload }) => { state.running = payload; },
        toggleSimRunning: (state, _) => { state.running = !state.running; },
        
        // area
        setSimArea: (state, { payload }) => { state.area = payload; },

        // camera
        setCameraSettings: (state, { payload }) => { state.camera = payload; },
        setCameraTarget: (state, { payload }) => { state.camera.target = payload; },
        moveCamera: (state, { payload }) => {  state.camera.target.x += payload.x;
                                                 state.camera.target.y += payload.y;
                                                },
        setCameraScaleSettings: (state, { payload }) => { state.camera.scale = payload; },
        setCameraMinScale: (state, { payload }) => { state.camera.scale.min = payload; },                                  
        setCameraMaxScale: (state, { payload }) => { state.camera.scale.max = payload; },                                  
        setCameraCurrentScale: (state, { payload }) => { state.camera.scale.current = Clamp(payload, state.camera.scale.min, state.camera.scale.max); },                                  
        changeCameraCurrentScale: (state, { payload }) => { state.camera.scale.current = 
                                                            Clamp(state.camera.scale.current + payload, state.camera.scale.min, state.camera.scale.max); 
                                                        },                                  
        setCameraScaleFactor: (state, { payload }) => { state.camera.scale.factor = payload; },

        setCameraMoveDirection: (state, { payload }) => { state.camera.move[payload.direction] = 
            state.camera.move[oppositeDirection(payload.direction)] && payload.move; },

        setCameraMoveDelta: (state, { payload }) => { state.camera.move.delta = payload; },
        
        // grid
        setGridSettings: (state, { payload }) => { state.grid = payload; },
        setGridDraw: (state, { payload }) => { state.grid.draw = payload; },
        setGridIntensity: (state, { payload }) => { state.grid.intensity = payload; },
        setGridHighLight: (state, { payload }) => { state.grid.highLight = payload; },        
    }
});