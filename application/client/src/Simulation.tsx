/**
 * File: ui/Simulation.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Simulation updating and drawing.
 * 
 */

// import react
import React, { useContext, useCallback } from "react";

// import state
import { SimStateContext } from "./AppState";
 
// import p5
import P5Sketch, { P5 } from "./ui/P5Sketch";

// import redux utilities and slices
import { useSelector, useDispatch } from "react-redux";
import { moveCamera, centerCameraToArea, changeCameraScale } from "./state/slices/sim";
import { setDimensions } from "./state/slices/global";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useCanvasStylers, Style } from "./stylers";

// import type information
import { StateShape } from "./types/redux";
import { SimState } from "./types/simulation";

type GridLineOptions = {

    intensity: number;
    boundary: number;
    highlight: number;
    getCoordinates: (_: number) => { x1: number, x2: number, y1: number, y2: number };
};

/// Styles & style hooks

const parentStyle = Style.create({

    // fill parent
    position: "absolute",
    top: "0",
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

/// Setup hooks

function useSetup(state: SimState) {

    const dispatch = useDispatch();
    
    return useCallback((p5: P5) => {

        dispatch(setDimensions({ width: p5.windowWidth, height: p5.windowHeight }));

        dispatch(centerCameraToArea());

    }, [dispatch]);
}

/// Draw & Update hooks

function useUpdateEntities(state: SimState) {

    // get redux state
    const speedModifier = useSelector((state: StateShape) => state.sim.speed.current);
    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);

    return useCallback((p5: P5) => {

        if(simRunning) {

            const scaledDelta = state.time.delta.current * speedModifier;
            
            state.entities.context.current.update(scaledDelta);
        }

    }, [state.entities.context, state.time.delta, speedModifier, simRunning]);
} 

function useUpdate(state: SimState) {

    const dispatch = useDispatch();
    
    const updateEntities = useUpdateEntities(state);

    return useCallback((p5: P5) => {

        state.time.update();
        dispatch(moveCamera(state.time.delta.current));
        updateEntities(p5);

    }, [state.time, updateEntities, dispatch]);
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

    const entityStyler = useCanvasStylers("entity");
    const perceptionStyler = useCanvasStylers("entityPerception");
    const percievedStyler = useCanvasStylers("entityPercived");
    const quadtreeStyler = useCanvasStylers("quadtree");

    return useCallback((p5: P5) => {

        state.entities.context.current.draw(p5, {

            entity: entityStyler,
            perception: perceptionStyler,
            percieved: percievedStyler,
            quadtree: quadtreeStyler
        });

    }, [state.entities, 
        entityStyler,
        perceptionStyler,
        percievedStyler,
        quadtreeStyler]);
}

function useDraw(state: SimState) {

    const drawBackground = useDrawBackground();
    const transform = useTransform();
    const drawArea = useDrawArea();
    const drawGrid = useDrawGrid();
    const drawBoundary = useDrawBoundary();
    const drawEntities = useDrawEntities(state);

    return useCallback((p5: P5) => {

        p5.push();
        drawBackground(p5);
        transform(p5);
        drawArea(p5);
        drawGrid(p5);
        drawBoundary(p5);
        drawEntities(p5);
        p5.pop();

    }, [drawBackground, 
        transform, 
        drawArea, 
        drawGrid, 
        drawBoundary, 
        drawEntities]);
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

        // set app dimensions
        dispatch(setDimensions({ width: p5.windowWidth, height: p5.windowHeight }));
    
    }, [dispatch]);

    const onMouseDown = useCallback(({ clientX: x, clientY: y }: React.MouseEvent): void => {
        
        const context = state.entities.context.current;
        
        const position = state.entities.screenToCanvas({ x, y });
        const entity = context.entityAt(position.x, position.y);

        if(entity !== undefined) {

            context.selectEntity(entity);

        } else {

            state.mouse.setDragging(true);

            state.mouse.setLastPosition({ x, y });
        }

    }, [state.mouse, state.entities]);
    
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

    const state = useContext(SimStateContext);

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

    const dimensions = useSelector((state: StateShape) => state.global.dimensions);

    return <P5Sketch classNames={classes.parent} {...eventHandlers} tabIndex={0} dimensions={dimensions} />;
}