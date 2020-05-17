/**
 * File: state/simulation.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Defines simulation state hooks.
 * 
 */

// import react
import { useRef, useState, useCallback, useEffect } from "react";

// import redux
import { useSelector } from "react-redux"; 

// import utilities
import lodash from "lodash";

// import entities
import { Context as EntityContext } from "../entities/entity";

// import type information
import { Position2D } from "../types/utils";
import { StateShape } from "../types/redux";
import { SimState } from "../types/simulation";

function useTime() {

    const speedModifier = useSelector((state: StateShape) => state.sim.speed.current);
    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);

    // default to invalid stamp and delta
    const delta = useRef(0);
    const stamp = useRef(0);
    const elapsed = useRef(0);

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

        if(simRunning) {

            elapsed.current += speedModifier * delta.current;
        }

    }, [delta, stamp, simRunning, speedModifier]);

    useEffect(() => {

        const handler = () => {

            if(document.hidden) {

                // invalidate stamp on tab blur
                stamp.current = 0;
            }
        };

        document.addEventListener("visibilitychange", handler);

        return () => {

            document.removeEventListener("visibilitychange", handler);
        };

    }, []);

    return {

        delta,
        stamp,
        elapsed,
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

    const update = useCallback(() => {

        if(delta.current > 0) {

            fps.current = 1000 / delta.current;
        }

    }, [delta]);

    // start update loop
    useEffect(() => {

        const id = window.setInterval(update, 500);
        
        return () => {

            window.clearInterval(id);
        }

    }, [update]);

    return fps;
}

function useEntities() {
    
    const dimensions = useSelector((state: StateShape) => state.global.dimensions);
    const cameraTarget = useSelector((state: StateShape) => state.sim.camera.target);
    const scale = useSelector((state: StateShape) => state.sim.camera.scale.current);
    
    const context = useRef<EntityContext>(null as any);

    useEffect(() => {

        context.current = new EntityContext();

    // do not include area, call constructor only once    
    // eslint-disable-next-line
    }, []);

    const screenToCanvas = useCallback(({ x, y }: Position2D) => {

        return { 
            x: (x - dimensions.width / 2 + cameraTarget.x) / scale, 
            y: (y - dimensions.height / 2 + cameraTarget.y) / scale
        };

    }, [dimensions.width, 
        dimensions.height,
        cameraTarget.x,
        cameraTarget.y,
        scale]); 
    
    return {
        
        screenToCanvas,
        context
    };
}

export function useSimState(): SimState {

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