/**
 * File: state/stats.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Defines state hooks for statistics.
 * 
 */

// import react
import { useRef, useContext, useEffect, useCallback } from "react";

// import redux
import { useSelector } from "react-redux";

// import sim state
import { SimStateContext } from "../AppState";

// import type information
import { StatsState } from "../types/stats";
import { SimState } from "../types/simulation";
import { StateShape } from "../types/redux";

function useFps(simState: SimState, pollingRate: number) {

    const array = useRef<Array<{ fps: number }>>([]);
    const current = useRef(0);

    useEffect(() => {

        const id = window.setInterval(() => {

            const fps = simState.fps.current;
            
            array.current.push({ fps: Math.round(fps) });

            if(array.current.length > 50) {

                array.current.splice(0, 1);
            }

            current.current = fps;

        }, pollingRate);

        return () => {

            window.clearInterval(id);
        }

    }, [pollingRate, simState.fps]);

    return {

        array,
        current
    }
}

function useEntities(simState: SimState, pollingRate: number) {

    const predators = useRef(0);
    const preys = useRef(0);
    const array = useRef<Array<{ predators: number, preys: number, stamp: number }>>([]);

    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);

    const update = useCallback(() => {

        if(!simRunning || simState.time.delta.current === 0) return;

        const predatorCount = simState.entities.context.current.entityCount("predator");
        const preyCount = simState.entities.context.current.entityCount("prey");
        const timeStamp = Math.round(simState.time.elapsed.current / 1000);

        predators.current = predatorCount;
        preys.current = preyCount;

        array.current.push({ predators: predatorCount, preys: preyCount, stamp: timeStamp });

        if(array.current.length > 500) {

            array.current.splice(0, 1);
        }

    }, [simState.entities.context, simState.time.delta, simRunning, simState.time.elapsed]);

    useEffect(() => {

        const id = window.setInterval(update, pollingRate);

        return () => {

            window.clearInterval(id);
        }

    }, [pollingRate, update]);
    
    return {
        
        predators,
        preys,
        array
    };
}

export function useStatsState(): StatsState {

    const simState = useContext(SimStateContext);

    const fps = useFps(simState, 200);
    const entities = useEntities(simState, 500);

    return {

        fps,
        entities
    };
}