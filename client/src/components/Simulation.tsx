/**
 * File: Simulation.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Simulation implementation, including drawing using p5 library.
 * 
 */

// import react
import React, { useRef, useEffect, useState, useCallback } from "react";

// import utilities
import lodash from "lodash";

// import p5
import P5Sketch from "./P5Sketch";
import P5 from "p5";

// import react-redux
import { useSelector } from "react-redux";
 
// import stylers
import { makeStyles } from "@material-ui/core/styles";
import { simStylers, SimStylerList } from "../stylers";

// import hotkeys
import { HotKeyContext } from "../hotkeys";

// import type information
import { StateShape } from "../state/defaultState";
import { Position2D, Dimensions2D } from "../types"

/// Type definitions

export enum SimZoomTarget {

    CURSOR,
    CENTER
};

type GridLineOptions = {

    intensity: number;
    boundary: number;
    highlight: number;
    getCoordinates: (_: number) => { x1: number, x2: number, y1: number, y2: number };
};

/// State hooks and methods

function useDimensions() {

    const dimensions = useRef<Dimensions2D>({ width: 0, height: 0 });

    return dimensions;
}

function useDimensionsMethods({ dimensions }: SimState) {

    const setDimensions = useCallback((newDimensions: Dimensions2D) => {

        dimensions.current = lodash.cloneDeep(newDimensions);

    }, [dimensions]);

    return { setDimensions };
}

function useTime() {

    // assume 60 FPS for the first iteration
    const delta = useRef(1000 / 60);

    const stamp = useRef(new Date().getTime());

    return {

        delta,
        stamp
    };
}

function useTimeMethods({ time }: SimState) {

    const updateTime = useCallback(() => {

        const newStamp = new Date().getTime();
        time.delta.current = newStamp - time.stamp.current;
        time.stamp.current = newStamp;

    }, [time.delta, time.stamp]);

    return { updateTime };
}

function useCamera() {

    const target = useRef<Position2D>({ x: 0, y: 0 });
    const scale  = useRef(1.0);

    return {

        target,
        scale
    }
}

function useCameraMethods({ camera, dimensions }: SimState) {

    const scaleSettings = useSelector((state: StateShape) => state.sim.camera.scale);
    const area = useSelector((state: StateShape) => state.sim.area);

    const clampToArea = useCallback(() => {

        const target = camera.target.current;
        const margin = 150;

        target.x = lodash.clamp(target.x, - dimensions.current.width  + margin, area.width  - margin);
        target.y = lodash.clamp(target.y, - dimensions.current.height + margin, area.height - margin);

    }, [camera.target, dimensions, area.width, area.height]);

    const moveCamera = useCallback((delta: Position2D) => {

        camera.target.current.x += delta.x;
        camera.target.current.y += delta.y;

        clampToArea();

    }, [camera.target, clampToArea]);

    const adjustPosition = useCallback((target: Position2D, scaleDelta: number) => {

        const currentTarget = camera.target.current;
        const currentScale = camera.scale.current;

        const positionDelta: Position2D = {

            x: ((target.x + currentTarget.x) / currentScale) * scaleDelta,
            y: ((target.y + currentTarget.y) / currentScale) * scaleDelta
        }

        moveCamera(positionDelta);

    }, [camera.scale, camera.target, moveCamera]);

    const changeCameraScale = useCallback((modifier: number, mousePosition: Position2D) => {

        if(!scaleSettings.enabled) return;

        let target: Position2D = { x: 0, y: 0 };

        switch(scaleSettings.target) {

            case SimZoomTarget.CURSOR:

                target = lodash.cloneDeep(mousePosition);
                break;
            
            case SimZoomTarget.CENTER:

                target = {

                    x: dimensions.current.width / 2,
                    y: dimensions.current.height / 2,
                };
                break;
        }

        const newScale = lodash.clamp(camera.scale.current + (scaleSettings.delta * modifier), 
                                        scaleSettings.min, scaleSettings.max);

        const scaleDelta = newScale - camera.scale.current;

        adjustPosition(target, scaleDelta);

        camera.scale.current= newScale;

    }, [adjustPosition, 
        scaleSettings.delta, 
        scaleSettings.min, 
        scaleSettings.max, 
        scaleSettings.enabled, 
        scaleSettings.target,
        dimensions,
        camera.scale]);

    const centerCameraToArea = useCallback(() => {

        const target = camera.target.current;

        target.x = (- dimensions.current.width / 2) + area.width / 2;
        target.y = (- dimensions.current.height / 2) + area.height / 2 ;

    }, [camera.target, area.width, area.height, dimensions]);

    return {

        moveCamera,
        changeCameraScale,
        centerCameraToArea
    };
}

function useMouse() {

    const dragging = useRef(false);
    const lastPosition = useRef<Position2D>({ x: 0, y: 0 });

    return { 
        
        dragging,
        lastPosition
    };
}

function useMouseMethods({ mouse }: SimState) {

    const setMouseDragging = useCallback((dragging: boolean) => {

        mouse.dragging.current = dragging;

    }, [mouse.dragging]);

    const setMouseLastPosition = useCallback((position: Position2D) => {

        mouse.lastPosition.current = lodash.cloneDeep(position);

    }, [mouse.lastPosition]);

    return {

        setMouseDragging,
        setMouseLastPosition
    };
}

function useFps({ delta }: ReturnType<typeof useTime>) {

    // assume 60 FPS
    const fps = useRef(60);

    const intervalID = useRef(0);

    const update = useCallback(() => {

        fps.current = 1000 / delta.current;

    }, [delta]);

    // start update loop
    useEffect(() => {

        intervalID.current = window.setInterval(update, 500);
        
        return () => {

            window.clearInterval(intervalID.current);
        }

    }, [update]);

    return fps;
}

function useHotkeys() {

    const context = useRef(new HotKeyContext(500, true));

    const cleanupContext = useCallback(() => {

        context.current.clearBlurHandler();

    }, [context]);

    useEffect(() => {

        return cleanupContext;

    }, [cleanupContext]);

    return context;
}

function useSimState() {

    const dimensions = useDimensions();
    const time = useTime();
    const camera = useCamera();
    const mouse = useMouse();
    const fps = useFps(time);
    const hotkeys = useHotkeys();

    return {

        dimensions,
        time,
        camera,
        mouse,
        fps,
        hotkeys
    };
}

type SimState = ReturnType<typeof useSimState>;

/// Styler hooks

function useCanvasStylers(styler: SimStylerList) {

    const theme = useSelector((state: StateShape) => state.theme);

    return useCallback((p5: P5) => {

        simStylers[theme][styler](p5);

    }, [theme, styler]);
}

/// Keyboard hooks

const bindingList = [

    "moveCameraLeft",
    "moveCameraUp",      
    "moveCameraRight",   
    "moveCameraDown"

] as const;

export type SimulationBindings = typeof bindingList[number];

function useBindings(state: SimState) {

    const moveDelta = useSelector((state: StateShape) => state.sim.camera.moveDelta);
    const bindingCombinations = useSelector((state: StateShape) => state.keyboard.bindings);

    const { moveCamera } = useCameraMethods(state);
    
    const getMoveDelta = useCallback(() => {

        return (moveDelta / 1000) * state.time.delta.current * state.camera.scale.current; 

    }, [moveDelta]);

    type Bindings = { [binding in SimulationBindings]: () => any };

    const bindingCallbacks = useRef<Bindings>({

        moveCameraUp:       () => moveCamera({ x: 0, y: -getMoveDelta() }),
        moveCameraRight:    () => moveCamera({ x: getMoveDelta(), y: 0 }),
        moveCameraDown:     () => moveCamera({ x: 0, y: getMoveDelta() }),
        moveCameraLeft:     () => moveCamera({ x: -getMoveDelta(), y: 0 })
    });

    return useCallback(() => {
 
        for(const binding of bindingList) {

            const combination = bindingCombinations[binding];
            // console.log(combination);

            if(state.hotkeys.current.isCombinationPressed(combination)) {

            bindingCallbacks.current[binding]();
            }
        }

    }, [bindingCombinations, state.hotkeys, bindingCallbacks]);
}

/// Setup hooks

function useSetup(state: SimState) {

    const { setDimensions } = useDimensionsMethods(state);
    const { centerCameraToArea } = useCameraMethods(state);
    
    return useCallback((p5: P5) => {

        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        setDimensions({ width: p5.windowWidth, height: p5.windowHeight });

        centerCameraToArea();

    }, [setDimensions, centerCameraToArea]);
}

/// Draw & Update hooks

function useUpdate(state: SimState) {

    const { updateTime } = useTimeMethods(state);
    const runBindings = useBindings(state);

    return useCallback(() => {

        updateTime();
        runBindings();

    }, [updateTime, runBindings]);
}

function useDrawBackground() {

    const styler = useCanvasStylers("background");

    return useCallback((p5: P5) => {

        styler(p5);
        
    }, [styler]);
}

function useTransform(state: SimState) {
    
    return useCallback((p5: P5) => {

        const target = state.camera.target.current;
        const scale = state.camera.scale.current;

        p5.translate(-target.x, -target.y);
        p5.scale(scale);

    }, [state.camera.target, state.camera.scale]);
}

function useDrawArea() {

    const styler = useCanvasStylers("area");

    const area = useSelector((state: StateShape) => state.sim.area);

    return useCallback((p5: P5) => {

        styler(p5);
        
        p5.rect(0, 0, area.width, area.height)

    }, [styler, area.height, area.width]);
}

function useDrawGridLines() {

    const gridStyler = useCanvasStylers("grid");
    const highlightStyler = useCanvasStylers("gridHighlight");
    
    return useCallback((p5: P5, options: GridLineOptions) => {

        gridStyler(p5);

        for(let i = 0; i * options.intensity < options.boundary; i++) {
            
            p5.push();

            if(options.highlight && (i % options.highlight === 0)) {
                
                highlightStyler(p5);
            }
            
            let coord = options.getCoordinates(i * options.intensity);
            p5.line(coord.x1, coord.y1, coord.x2, coord.y2);
            
            p5.pop();
        }

    }, [gridStyler, highlightStyler]);
}

function useDrawGrid() {

    const grid = useSelector((state: StateShape) => state.sim.grid);
    const area = useSelector((state: StateShape) => state.sim.area);

    const drawGridLines = useDrawGridLines();
    
    return useCallback((p5: P5) => {

        if(!grid.draw) return;

        drawGridLines(p5, { intensity: grid.intensity, boundary: area.width,
                            highlight: grid.highlight,
                            getCoordinates: (x: number) => ({ x1: x, y1: 0, x2: x, y2: area.height }) });

        drawGridLines(p5, { intensity: grid.intensity, boundary: area.height,
                            highlight: grid.highlight,
                            getCoordinates: (y: number) => ({ x1: 0, y1: y, x2: area.width, y2: y }) });

    }, [drawGridLines, area.width, area.height, grid.draw, grid.highlight, grid.intensity]);
}

function useDrawBoundary() {

    const styler = useCanvasStylers("boundingBox");
    const area = useSelector((state: StateShape) => state.sim.area);
    
    return useCallback((p5: P5) => {

        styler(p5);

        p5.rect(0, 0, area.width, area.height);

    }, [styler, area.height, area.width]);
}

function useDrawFPS(state: SimState) {

    const styler = useCanvasStylers("fps");

    return useCallback((p5: P5) => {

        p5.textAlign(p5.RIGHT);
        styler(p5);
        p5.text(`FPS: ${state.fps.current.toFixed(2)}`, p5.windowWidth - 10, p5.windowHeight - 10);

    }, [state.fps, styler]);
}

function useDraw(state: SimState) {

    const drawBackground = useDrawBackground();
    const transform = useTransform(state);
    const drawArea = useDrawArea();
    const drawGrid = useDrawGrid();
    const drawBoundary = useDrawBoundary();
    const drawFPS = useDrawFPS(state);

    return useCallback((p5: P5) => {

        p5.push();
        drawBackground(p5);
        transform(p5);
        drawArea(p5);
        drawGrid(p5);
        drawBoundary(p5);
        p5.pop();
        drawFPS(p5);

    }, [drawBackground, transform, drawArea, drawGrid, drawBoundary, drawFPS]);
}

function useLoop(state: SimState) {
    
    const update = useUpdate(state);
    const draw = useDraw(state);

    return useCallback((p5: P5) => {

        update();
        draw(p5);

    }, [update, draw]);
}

/// Event handlers hook

function useEventHandlers(state: SimState) {

    const { setDimensions } = useDimensionsMethods(state);
    const { setMouseDragging, setMouseLastPosition } = useMouseMethods(state);
    const { moveCamera, changeCameraScale } = useCameraMethods(state);

    const windowResized = useCallback((p5: P5) => {

        // resize canvas when parent div is resized
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        setDimensions({ width: p5.windowWidth, height: p5.windowHeight });
    
    }, [setDimensions]);

    const onKeyDown = useCallback((event: React.KeyboardEvent): void => {

        if(event.repeat) return;
        
        state.hotkeys.current.onKeyChanged(event.nativeEvent, true);

    }, [state.hotkeys]);

    const onKeyUp = useCallback((event: React.KeyboardEvent): void => {

        state.hotkeys.current.onKeyChanged(event.nativeEvent, false);

    }, [state.hotkeys]);

    const onMouseDown = useCallback((event: React.MouseEvent): void => {

        setMouseDragging(true);
        setMouseLastPosition({ x: event.clientX, y: event.clientY });

    }, [setMouseDragging, setMouseLastPosition]);
    
    const onMouseUp = useCallback((_: React.MouseEvent): void => {
        
        setMouseDragging(false);

    }, [setMouseDragging]);

    const onMouseDrag = useCallback((event: React.MouseEvent): void => {

        const lastPosition = state.mouse.lastPosition.current;

        const dx = lastPosition.x - event.clientX;
        const dy = lastPosition.y - event.clientY;

        moveCamera({ x: dx, y: dy });

        setMouseLastPosition({ x: event.clientX, y: event.clientY });

    }, [moveCamera, setMouseLastPosition, state.mouse.lastPosition]);

    const onMouseMove = useCallback((event: React.MouseEvent): void => {

        if(state.mouse.dragging.current) {

            onMouseDrag(event);
        }

    }, [onMouseDrag, state.mouse.dragging]);

    const onMouseLeave = useCallback((event: React.MouseEvent): void => {

        setMouseDragging(false);
    
    }, [setMouseDragging]);

    const onWheel = useCallback(({ deltaY, clientX, clientY }: React.WheelEvent): void => {

        // ignore non-standard value
        // wheel-up = negative value - should increase zoom
        // wheel-down = positive value - should decrease zoom
        // invert sign to achieve desired behavior
        const zoomModifier = -Math.sign(deltaY);
        changeCameraScale(zoomModifier, { x: clientX, y: clientY });

    }, [changeCameraScale]);

    return {

        windowResized,
        onKeyDown,
        onKeyUp,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
        onWheel
    };
}

/// Simulation hook

function useSimulation() {

    const state = useSimState();

    const setup = useSetup(state);
    const loop = useLoop(state);

    const eventHandlers = useEventHandlers(state);

    return {
    
        loop,
        setup,
        ...eventHandlers
    }
}

/// Component defintion

export default function() {

    const { ...eventHandlers } = useSimulation();

    return <P5Sketch {...eventHandlers} tabIndex={0} />;
}