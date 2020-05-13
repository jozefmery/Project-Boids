// TODO header

// import react
import { useRef, useContext, useEffect } from "react";

// import sim state
import { SimStateContext } from "../AppState";

// import type information
import { StatsState } from "../types/stats";
import { SimState } from "../types/simulation";

function useFps(simState: SimState, pollingRate: number) {

    const array = useRef<Array<{ uv: number }>>([]);
    const current = useRef(0);

    useEffect(() => {

        const id = window.setInterval(() => {

            const fps = simState.fps.current;
            
            array.current.push({ uv: Math.round(fps) });

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

    const predators = useRef<{ count: number, array: Array<number> }>({ count: 0, array: [] });
    const preys = useRef<{ count: number, array: Array<number> }>({ count: 0, array: [] });

    useEffect(() => {

        const id = window.setInterval(() => {

            const predatorCount = simState.entities.context.current.entityCount("predator");
            const preyCount = simState.entities.context.current.entityCount("prey");

            predators.current.array.push(predatorCount);
            predators.current.count = predatorCount;

            preys.current.array.push(preyCount);
            preys.current.count = preyCount;

        }, pollingRate);

        return () => {

            window.clearInterval(id);
        }

    }, [pollingRate, simState.entities.context]);
    
    return {
        
        predators,
        preys
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