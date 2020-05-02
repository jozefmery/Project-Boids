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

// import redux utilities and slices
import { useSelector, useDispatch } from "react-redux";
import { moveCamera, centerCameraToArea, changeCameraScale } from "../state/simSlice";
import { setDimensions } from "../state/globalSlice";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { simStylers, SimStylerList, Style } from "../stylers";

// import entities
import { Context as EntityContext } from "../entities/entity";

// import type information
import { StateShape } from "../state/types";
import { Position2D } from "../types"

/// Type definitions

type GridLineOptions = {

    intensity: number;
    boundary: number;
    highlight: number;
    getCoordinates: (_: number) => { x1: number, x2: number, y1: number, y2: number };
};

/// State hooks

function useTime() {

    // default to invalid stamp and delta
    const delta = useRef(0);
    const stamp = useRef(0);

    const update = useCallback(() => {

        const newStamp = new Date().getTime();

        // check if stamp is valid
        // first iteration will have 0 time delta
        // to make sure first delta is not too big
        if(stamp.current) {

            delta.current = newStamp - stamp.current;
            
        } else {
            
            delta.current = 0;
        }

        stamp.current = newStamp;

    }, [delta, stamp]);

    return {

        delta,
        stamp,
        update
    };
}

function useCamera() {

    // use state to enable using in styles and triggering
    // rerendering
    const [zoomModifier, setModifier] = useState(0);

    const timeout = useRef(0);

    const resetZoomModifier = useCallback(() => setModifier(0), []);

    // use effect is not sufficient, because timeout needs to be cleared
    // whenever zoomModifier is written to and not only on change
    const setZoomModifier = useCallback((modifier: number) => {

        setModifier(modifier);
        window.clearTimeout(timeout.current);
        timeout.current = window.setTimeout(resetZoomModifier, 500);

    }, [resetZoomModifier]);

    return {

        zoomModifier,
        setZoomModifier
    }
}

function useMouse() {

    // use state to enable using in styles and triggering
    // rerendering
    const [dragging, setDragging] = useState(false);
    // initial last position doesn't matter
    const lastPosition = useRef<Position2D>({ x: 0, y: 0 });

    const setLastPosition = useCallback((position: Position2D) => {

        lastPosition.current = lodash.cloneDeep(position);

    }, [lastPosition]);

    return { 
        
        dragging,
        setDragging,
        lastPosition,
        setLastPosition
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

function useEntities() {

    const area = useSelector((state: StateShape) => state.sim.area);

    const context = useRef(new EntityContext(area));

    useEffect(() => {

        context.current.setArea(area);

    }, [area]);

    return {
        
        context
    };
}

function useSimState() {

    const time = useTime();
    const camera = useCamera();
    const mouse = useMouse();
    const fps = useFps(time);
    const entities = useEntities();

    return {

        time,
        camera,
        mouse,
        fps,
        entities
    };
}

type SimState = ReturnType<typeof useSimState>;

/// Styles & style hooks

function useCanvasStylers(styler: SimStylerList) {

    const theme = useSelector((state: StateShape) => state.global.theme);

    return useCallback((p5: P5) => {

        simStylers[theme][styler](p5);

    }, [theme, styler]);
}

const parentStyle = Style.create({

    // fill parent
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",

    cursor: ({ mouse, camera }: SimState) => {

        switch(camera.zoomModifier) {

            case 1: return "zoom-in";
            case -1: return "zoom-out";
        }

        if(mouse.dragging) return "grabbing";

        return "grab";
    }
});

const useStyles = makeStyles(({ theme }: Theme) => ({

    parent: parentStyle.compose(theme)
}));

// function useBindings(state: SimState) {

//     // get hotkey context
//     const hotkeys = useContext(HotkeyContext);

//     // get redux state and dispatch
//     const dispatch = useDispatch();

//     const moveDelta = useSelector((state: StateShape) => state.sim.camera.moveDelta);
//     const bindingCombinations = useSelector((state: StateShape) => state.keyboard.bindings);
//     const scale = useSelector((state: StateShape) => state.sim.camera.scale.current);


//     const getMoveDelta = useCallback(() => {

//         return (moveDelta / 1000) * state.time.delta.current * scale; 

//     }, [moveDelta, state.time.delta, scale]);

//     type Bindings = { [binding in SimulationBindings]: () => unknown };

//     const bindingCallbacks = useRef<Bindings>({

//         moveCameraUp: () => dispatch(moveCamera({ x: 0, y: -getMoveDelta() })),

//         moveCameraRight: () => dispatch(moveCamera({ x: getMoveDelta(), y: 0 })),

//         moveCameraDown: () => dispatch(moveCamera({ x: 0, y: getMoveDelta() })),

//         moveCameraLeft: () => dispatch(moveCamera({ x: -getMoveDelta(), y: 0 }))
//     });

//     return useCallback(() => {
 
//         for(const binding of simulationBindingList) {

//             const combination = bindingCombinations[binding];

//             if(hotkeys.isCombinationPressed(combination)) {

//                 bindingCallbacks.current[binding]();
//             }
//         }

//     }, [bindingCombinations, bindingCallbacks, hotkeys]);
// }

/// Setup hooks

function useSetup(state: SimState) {

    const dispatch = useDispatch();
    
    return useCallback((p5: P5) => {

        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        dispatch(setDimensions({ width: p5.windowWidth, height: p5.windowHeight }));

        dispatch(centerCameraToArea());

        state.entities.context.current.add(0);

    }, [dispatch, state.entities.context]);
}

/// Draw & Update hooks

function useUpdateEntities(state: SimState) {

    // get redux state
    const speedModifier = useSelector((state: StateShape) => state.sim.speed.current);
    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);

    return useCallback((p5: P5) => {

        if(simRunning) {

            const scaledDelta = state.time.delta.current * speedModifier;
            
            state.entities.context.current.updateAll(scaledDelta);
        }

    }, [state.entities.context, state.time.delta, speedModifier, simRunning]);
} 

function useUpdate(state: SimState) {

    const updateEntities = useUpdateEntities(state);

    return useCallback((p5: P5) => {

        state.time.update();
        updateEntities(p5);

    }, [state.time, updateEntities]);
}

function useDrawBackground() {

    const styler = useCanvasStylers("background");

    return useCallback((p5: P5) => {

        styler(p5);
        
    }, [styler]);
}

function useTransform() {

    const target = useSelector((state: StateShape) => state.sim.camera.target);
    const scale = useSelector((state: StateShape) => state.sim.camera.scale.current);
    
    return useCallback((p5: P5) => {

        p5.translate(-target.x + p5.windowWidth / 2, -target.y + p5.windowHeight / 2);
        p5.scale(scale);

    }, [target, scale]);
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

function useDrawEntities(state: SimState) {

    return useCallback((p5: P5) => {

        state.entities.context.current.drawAll(p5);

    }, [state.entities]);
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
    const transform = useTransform();
    const drawArea = useDrawArea();
    const drawGrid = useDrawGrid();
    const drawBoundary = useDrawBoundary();
    const drawEntities = useDrawEntities(state);
    const drawFPS = useDrawFPS(state);

    return useCallback((p5: P5) => {

        p5.push();
        drawBackground(p5);
        transform(p5);
        drawArea(p5);
        drawGrid(p5);
        drawBoundary(p5);
        drawEntities(p5);
        p5.pop();
        drawFPS(p5);

    }, [drawBackground, 
        transform, 
        drawArea, 
        drawGrid, 
        drawBoundary, 
        drawEntities,
        drawFPS]);
}

function useLoop(state: SimState) {
    
    const update = useUpdate(state);
    const draw = useDraw(state);

    return useCallback((p5: P5) => {

        update(p5);
        draw(p5);

    }, [update, draw]);
}

/// Event handlers hook

function useEventHandlers(state: SimState) {

    const dispatch = useDispatch();

    const windowResized = useCallback((p5: P5) => {

        // resize canvas when parent div is resized
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        dispatch(setDimensions({ width: p5.windowWidth, height: p5.windowHeight }));
    
    }, [dispatch]);

    const onMouseDown = useCallback((event: React.MouseEvent): void => {

        state.mouse.setDragging(true);

        state.mouse.setLastPosition({ x: event.clientX, y: event.clientY });

    }, [state.mouse]);
    
    const onMouseUp = useCallback((_: React.MouseEvent): void => {
        
        state.mouse.setDragging(false);

    }, [state.mouse]);

    const onMouseDrag = useCallback((event: React.MouseEvent): void => {

        const lastPosition = state.mouse.lastPosition.current;

        const dx = lastPosition.x - event.clientX;
        const dy = lastPosition.y - event.clientY;

        dispatch(moveCamera({ x: dx, y: dy }));

        state.mouse.setLastPosition({ x: event.clientX, y: event.clientY });

    }, [state.mouse, dispatch]);

    const onMouseMove = useCallback((event: React.MouseEvent): void => {

        if(state.mouse.dragging) {

            onMouseDrag(event);
        }

    }, [onMouseDrag, state.mouse.dragging]);

    const onMouseLeave = useCallback((_: React.MouseEvent): void => {

        state.mouse.setDragging(false);
    
    }, [state.mouse]);

    const onWheel = useCallback(({ deltaY, clientX, clientY }: React.WheelEvent): void => {

        // ignore non-standard value
        // wheel-up = negative value - should increase zoom
        // wheel-down = positive value - should decrease zoom
        // invert sign to achieve desired behavior
        const zoomModifier = -Math.sign(deltaY);
        state.camera.setZoomModifier(zoomModifier);
        dispatch(changeCameraScale(zoomModifier, { x: clientX, y: clientY }));

    }, [state.camera, dispatch]);

    return {

        windowResized,
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

    const classes = useStyles(state);

    return {
    
        loop,
        setup,
        classes,
        ...eventHandlers
    }
}

/// Component defintion

export default function() {

    const { classes, ...eventHandlers } = useSimulation();

    return <P5Sketch classNames={classes.parent} {...eventHandlers} tabIndex={0} />;
}