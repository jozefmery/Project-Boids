/**
 * File: simSlice.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: 
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
        "setPreys": (state, action) => { state.entities.preys = action.payload; },
        // "addPrey": (state, action) => { state.entities.preys = action.payload; },
        // "removePrey": (state, action) => { state.entities.preys = action.payload; },

        "setPredators": (state, action) => { state.entities.predators = action.payload; },
        // "addPredators": (state, action) => { state.entities.predators = action.payload; },
        // "removePredators": (state, action) => { state.entities.predators = action.payload; },
        
        "setObjects": (state, action) => { state.entities.objects = action.payload; },
        // "addObjects": (state, action) => { state.entities.objects = action.payload; },
        // "removeObjects": (state, action) => { state.entities.objects = action.payload; },
        
        // state
        "setSimArea": (state, action) => { state.state.area = action.payload; },
        "setSimPlayState": (state, action) => { state.state.play = action.payload; },

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