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

// import utiltites
import lodash from "lodash";

// import default state
import defaultState from "./defaultState";

// import types
import { Position2D } from "../types";
import { SimZoomTarget } from "../components/SimulationTypes";
import { StateShape, Thunk } from "./types";

// create shorthand
const simState = defaultState.sim;

const simSlice = createSlice({

    name: "sim",
    initialState: defaultState.sim,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // whole state
        setSimSettings: (_, { payload: state }: PayloadAction<typeof simState>) => state,
        
        // speed
        setSimSpeedSettings: (state, { payload: speed }: PayloadAction<typeof simState.speed>) => {
            
            state.speed = speed;
        },

        setSimRunning: (state, { payload: running }: PayloadAction<typeof simState.speed.running>) => {
            
            state.speed.running = running;
        },

        toggleSimRunning: (state) => {
            state.speed.running = !state.speed.running;
        },

        setSpeed: (state, { payload: speed }: PayloadAction<typeof simState.speed.current>) => {
            
            state.speed.current = speed;
        },

        increaseSpeed: (state) => { 
            
            const speed = state.speed;

            speed.current = lodash.clamp(speed.current + speed.delta, speed.min, speed.max);
        },

        decreaseSpeed: (state) => { 
            
            const speed = state.speed;

            speed.current = lodash.clamp(speed.current - speed.delta, speed.min, speed.max);
        },

        setMinSpeed: (state, { payload: minSpeed }: PayloadAction<typeof simState.speed.min>) => {
            
            state.speed.min = minSpeed;
        },

        setMaxSpeed: (state, { payload: maxSpeed }: PayloadAction<typeof simState.speed.max>) => {
            
            state.speed.max = maxSpeed;
        },

        setSpeedDelta: (state, { payload: delta }: PayloadAction<typeof simState.speed.delta>) => {
            
            state.speed.delta = delta;
        },
        
        // area
        setSimArea: (state, { payload: area }: PayloadAction<typeof simState.area>) => {
            
            state.area = area;
        },

        // camera
        setCameraSettings: (state, { payload: camera }: PayloadAction<typeof simState.camera>) => {
            
            state.camera = camera;
        },

        setCameraCurrentScale: (state, { payload: scale }: PayloadAction<typeof simState.camera.scale.current>) => {
            
            state.camera.scale.current = scale;
        },

        setCameraMinScale: (state, { payload: min }: PayloadAction<typeof simState.camera.scale.min>) => {
            
            state.camera.scale.min = min;
        },

        setCameraMaxScale: (state, { payload: max }: PayloadAction<typeof simState.camera.scale.max>) => {
            
            state.camera.scale.max = max;
        },

        setCameraScaleDelta: (state, { payload: delta }: PayloadAction<typeof simState.camera.scale.delta>) => {
            
            state.camera.scale.delta = delta;
        },

        setCameraScaleEnabled: (state, { payload: enable }: PayloadAction<typeof simState.camera.scale.enabled>) => {
            
            state.camera.scale.enabled = enable;
        },

        setCameraScaleTarget: (state, { payload: target}: PayloadAction<typeof simState.camera.scale.target>) => {

            state.camera.scale.target = target;
        },

        setCameraMoveDirection: (state, { payload: direction }: PayloadAction<keyof typeof simState.camera.movement>) => {
            
            state.camera.movement[direction] = true;
        },

        resetCameraMoveDirection: (state, { payload: direction }: PayloadAction<keyof typeof simState.camera.movement>) => {
            
            state.camera.movement[direction] = false;
        },

        setCameraMoveDelta: (state, { payload: delta }: PayloadAction<typeof simState.camera.moveDelta>) => {
            
            state.camera.moveDelta = delta;
        },

        setCameraTarget: (state, { payload: target }: PayloadAction<Position2D>) => {
            
            state.camera.target = target;
        },

        setMinVisibleArea: (state, { payload: minVisibleArea }: PayloadAction<number>) => {
            
            state.camera.minVisibleArea = minVisibleArea;
        },
                              
        // grid
        setGridSettings: (state, { payload: grid }: PayloadAction<typeof simState.grid>) => {
            
            state.grid = grid;
        },

        setGridDraw: (state, { payload: draw }: PayloadAction<typeof simState.grid.draw>) => {
            
            state.grid.draw = draw;
        },

        toggleGridDraw: (state) => {
            
            state.grid.draw = !state.grid.draw;
        },

        setGridIntensity: (state, { payload: intensity }: PayloadAction<typeof simState.grid.intensity>) => {
            
            state.grid.intensity = intensity;
        },

        setGridHighlight: (state, { payload: highlight }: PayloadAction<typeof simState.grid.highlight>) => {
            
            state.grid.highlight = highlight;
        }
    }
});

const actions = simSlice.actions;

export const { 

    setSimSettings,
    setSimSpeedSettings,
    setSimRunning,
    toggleSimRunning,
    setSpeed,
    increaseSpeed,
    decreaseSpeed,
    setMinSpeed,
    setMaxSpeed,
    setSpeedDelta,
    setSimArea,
    setCameraSettings,
    setCameraMinScale,
    setCameraMaxScale,
    setCameraScaleDelta,
    setCameraScaleEnabled,
    setCameraScaleTarget,
    setCameraMoveDirection,
    resetCameraMoveDirection,
    setCameraMoveDelta,
    setGridSettings,
    setGridDraw,
    toggleGridDraw,
    setGridIntensity,
    setGridHighlight
            
} = actions;

function getClampedToArea(target: Position2D, state: StateShape): Position2D {

    // state shorthands
    const dimensions = state.global.dimensions;
    const scale = state.sim.camera.scale.current;

    // account for current scale
    const scaledMinVisible = state.sim.camera.minVisibleArea * scale;
    const scaledArea = {

        width: state.sim.area.width * scale,
        height: state.sim.area.height * scale,
    };

    return {

        x: lodash.clamp(target.x, 
            -dimensions.width / 2 + scaledMinVisible, 
            scaledArea.width - scaledMinVisible + dimensions.width / 2),

        y: lodash.clamp(target.y, 
            -dimensions.height / 2 + scaledMinVisible, 
            scaledArea.height - scaledMinVisible + dimensions.height / 2)
    }
}

export const moveCamera = (delta: Position2D | number): Thunk => (dispatch, getState) => {

    // state shorthands
    const state = getState();
    const { target: current, moveDelta, movement, scale } = state.sim.camera;

    const target = {

        x: current.x,
        y: current.y 
    };

    if(typeof delta === "number") {

        const axisDelta = moveDelta * delta / 1000 * scale.current;

        if(!Object.values(movement).reduce((sum, current) => sum || current, false)) return;

        if(movement.up) {

            target.y -= axisDelta; 
        }

        if(movement.right) {

            target.x += axisDelta;
        }

        if(movement.down) {

            target.y += axisDelta;
        }

        if(movement.left) {

            target.x -= axisDelta;
        }

    } else {
        
        target.x += delta.x;
        target.y += delta.y;
    }

    dispatch(actions.setCameraTarget(getClampedToArea(target, state)));
}

export const centerCameraToArea = (): Thunk => (dispatch, getState) => {

    // state shorthands
    const state = getState();
    const scale = state.sim.camera.scale.current;

    // account for current scale
    const scaledArea = {

        width: state.sim.area.width * scale,
        height: state.sim.area.height * scale,
    };

    // calculate area center
    const target = {

        x: scaledArea.width / 2,
        y: scaledArea.height / 2
    };

    // no need for clamping
    dispatch(actions.setCameraTarget(target));
}

const adjustPosition = (target: Position2D, scaleDelta: number, currentScale: number): Thunk => (dispatch, getState) => {

    // state shorthands
    const state = getState();
    const currentTarget = state.sim.camera.target;
    const dimensions = state.global.dimensions;

    const positionDelta: Position2D = {

        x: ((target.x + currentTarget.x - dimensions.width / 2) / currentScale) * scaleDelta,
        y: ((target.y + currentTarget.y - dimensions.height / 2) / currentScale) * scaleDelta
    }

    dispatch(moveCamera(positionDelta));
}

export const setCameraScale = (scale: number, mousePosition?: Position2D): Thunk => (dispatch, getState) => {
    
    // state shorthands
    const state = getState();
    const scaleSettings = state.sim.camera.scale;
    const dimensions = state.global.dimensions;

    if(!scaleSettings.enabled) return;

    let target: Position2D = { x: 0, y: 0 };

    if(mousePosition && scaleSettings.target === SimZoomTarget.CURSOR) {

        target = lodash.cloneDeep(mousePosition);
    
    } else {

        target = {

            x: dimensions.width / 2,
            y: dimensions.height / 2,
        };
    }

    const newScale = lodash.clamp(scale, scaleSettings.min, scaleSettings.max);

    const scaleDelta = newScale - scaleSettings.current;

    // update scale first to make sure clamping is correct
    dispatch(actions.setCameraCurrentScale(newScale));
    dispatch(adjustPosition(target, scaleDelta, scaleSettings.current));
}

export const changeCameraScale = (modifier: number, mousePosition?: Position2D): Thunk => (dispatch, getState) => {
    
    // state shorthands
    const state = getState();
    const { current, delta } = state.sim.camera.scale;

    dispatch(setCameraScale(current + delta * modifier, mousePosition));
}

export default simSlice.reducer;