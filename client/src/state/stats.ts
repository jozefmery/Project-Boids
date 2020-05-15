// TODO header

// import react
import { useRef, useContext, useEffect } from "react";

// import sim state
import { SimStateContext } from "../AppState";

// import type information
import { StatsState } from "../types/stats";
import { SimState } from "../types/simulation";

function useFps(simState: SimState, pollingRate: number) {

    const array = useRef<Array<{ fps: number }>>([]);
    const current = useRef(0);

    useEffect(() => {

        const id = window.setInterval(() => {

            const fps = simState.fps.current;
            
            array.current.push({ fps: Math.round(fps) });

            if(array.current.length > 500) {

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
    const array = useRef<Array<{ predators: number, preys: number }>>([]);

    useEffect(() => {

        // TODO update only when sim running

        const id = window.setInterval(() => {

            const predatorCount = simState.entities.context.current.entityCount("predator");
            const preyCount = simState.entities.context.current.entityCount("prey");

            predators.current = predatorCount;
            preys.current = preyCount;

            array.current.push({ predators: predatorCount, preys: preyCount });

            if(array.current.length > 500) {

                array.current.splice(0, 1);
            }

        }, pollingRate);

        return () => {

            window.clearInterval(id);
        }

    }, [pollingRate, simState.entities.context]);
    
    return {
        
        predators,
        preys,
        array
    };
}

export function useStatsState(): StatsState {

    const simState = useContext(SimStateContext);

    const fps = useFps(simState, 200);
    const entities = useEntities(simState, 3000);

    return {

        fps,
        entities
    };
}