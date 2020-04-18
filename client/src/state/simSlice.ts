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
import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit";

// import utiltites
import lodash from "lodash";

// import default state
import defaultState, { StateShape } from "./defaultState";

// import types
import { Position2D } from "../types";
import { SimZoomTarget } from "../components/SimulationDefs";

// create shorthand
const simState = defaultState.sim;

const simSlice = createSlice({

    name: "sim",
    initialState: defaultState.sim,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setSimSettings: (_, { payload: state }: PayloadAction<typeof simState>) => state,
        
        // running
        setSimRunning: (state, { payload: running }: PayloadAction<typeof simState.running>) => 
            { state.running = running; },
        toggleSimRunning: (state) => { state.running = !state.running; },
        
        // area
        setSimArea: (state, { payload: area }: PayloadAction<typeof simState.area>) => { state.area = area; },

        // camera
        setCameraSettings: (state, { payload: camera }: PayloadAction<typeof simState.camera>) => { state.camera = camera; },

        setCameraCurrentScale: (state, { payload: scale }: PayloadAction<typeof simState.camera.scale.current>) => 
            { state.camera.scale.current = scale; },
        setCameraMinScale: (state, { payload: min }: PayloadAction<typeof simState.camera.scale.min>) => 
            { state.camera.scale.min = min; },
        setCameraMaxScale: (state, { payload: max }: PayloadAction<typeof simState.camera.scale.max>) => 
            { state.camera.scale.max = max; },
        setCameraScaleDelta: (state, { payload: delta }: PayloadAction<typeof simState.camera.scale.delta>) => 
            { state.camera.scale.delta = delta; },
        setCameraScaleEnabled: (state, { payload: enable }: PayloadAction<typeof simState.camera.scale.enabled>) => 
            { state.camera.scale.enabled = enable; },
        setCameraScaleTarget: (state, { payload: target}: PayloadAction<typeof simState.camera.scale.target>) => 
            { state.camera.scale.target = target; },
        setCameraMoveDelta: (state, { payload: delta }: PayloadAction<typeof simState.camera.moveDelta>) => 
            { state.camera.moveDelta = delta; },
        setCameraTarget: (state, { payload: target }: PayloadAction<Position2D>) => 
            { state.camera.target = target; },
        setMinVisibleArea: (state, { payload: minVisibleArea }: PayloadAction<number>) => 
            { state.camera.minVisibleArea = minVisibleArea; },
                              
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

export const moveCamera = (delta: Position2D): ThunkAction<void, StateShape, unknown, Action<string>> => 
    
    (dispatch, getState) => {

        const state = getState();

        const currentTarget = state.sim.camera.target;
        const area = state.sim.area;
        const minVisibleArea = state.sim.camera.minVisibleArea;
        const dimensions = state.global.dimensions;

        const target = {

            x: lodash.clamp(currentTarget.x + delta.x, - dimensions.width  + minVisibleArea, area.width  - minVisibleArea),
            y: lodash.clamp(currentTarget.y + delta.y, - dimensions.height + minVisibleArea, area.height - minVisibleArea)
        };

        dispatch(simSlice.actions.setCameraTarget(target));
    }

export const centerCameraToArea = (): ThunkAction<void, StateShape, unknown, Action<string>> => 
    
    (dispatch, getState) => {

        const state = getState();

        const area = state.sim.area;
        const dimensions = state.global.dimensions;

        const target = {

            x: (- dimensions.width / 2) + area.width / 2,
            y: (- dimensions.height / 2) + area.height / 2
        };

        dispatch(simSlice.actions.setCameraTarget(target));
    }

const adjustPosition = (target: Position2D, scaleDelta: number): ThunkAction<void, StateShape, unknown, Action<string>> => 

    (dispatch, getState) => {

        const state = getState();
        const currentTarget = state.sim.camera.target;
        const currentScale = state.sim.camera.scale.current;

        const positionDelta: Position2D = {

            x: ((target.x + currentTarget.x) / currentScale) * scaleDelta,
            y: ((target.y + currentTarget.y) / currentScale) * scaleDelta
        }

        dispatch(moveCamera(positionDelta));
    }


export const changeCameraScale = (modifier: number, mousePosition: Position2D): ThunkAction<void, StateShape, unknown, Action<string>> => 

    (dispatch, getState) => {

        const state = getState();
        const scaleSettings = state.sim.camera.scale;
        const dimensions = state.global.dimensions;

        if(!scaleSettings.enabled) return;

        let target: Position2D = { x: 0, y: 0 };

        switch(scaleSettings.target) {

            case SimZoomTarget.CURSOR:

                target = lodash.cloneDeep(mousePosition);
                break;
            
            case SimZoomTarget.CENTER:

                target = {

                    x: dimensions.width / 2,
                    y: dimensions.height / 2,
                };
                break;
        }

        const newScale = lodash.clamp(scaleSettings.current + (scaleSettings.delta * modifier), 
                                        scaleSettings.min, scaleSettings.max);

        const scaleDelta = newScale - scaleSettings.current;

        dispatch(adjustPosition(target, scaleDelta));

        dispatch(simSlice.actions.setCameraCurrentScale(newScale));
    }

export const { 

    setSimSettings,
    setSimRunning,
    toggleSimRunning,
    setSimArea,
    setCameraSettings,
    setCameraMinScale,
    setCameraMaxScale,
    setCameraScaleDelta,
    setCameraScaleEnabled,
    setCameraScaleTarget,
    setCameraMoveDelta,
    setGridSettings,
    setGridDraw,
    toggleGridDraw,
    setGridIntensity,
    setGridHighlight
            
} = simSlice.actions;

export default simSlice.reducer;