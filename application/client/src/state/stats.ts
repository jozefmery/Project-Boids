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
import { useContext, useEffect, useCallback, useState } from "react";

// import redux
import { useSelector } from "react-redux";

// import sim state
import { SimStateContext } from "../AppState";

// import type information
import { StatsState, FpsStats, EntityStats, StatTypes } from "../types/stats";
import { SimState } from "../types/simulation";
import { StateShape } from "../types/redux";
import { Entity } from "../entities";

function useFps(simState: SimState, pollingRate: number): FpsStats {

    const [array, setArray] = useState<FpsStats["array"]>([]);
    const [current, setCurrent] = useState<FpsStats["current"]>(0);

    useEffect(() => {

        const id = window.setInterval(() => {

            const fps = simState.fps.current;

            setCurrent(fps);

            setArray(previous => {

                previous.push({ fps: Math.round(fps) });
                
                if(previous.length > 300) {
                    
                    previous.splice(0, 1);
                }
                    
                return [ ...previous ];
            });

            
        }, pollingRate);

        return () => {

            window.clearInterval(id);
        }
    
    // array is not supposed to be part of the effects
    }, [pollingRate, simState.fps]);

    return {

        array,
        current
    }
}

const averageCalculators: {

    [stat in Exclude<StatTypes, "count">]: (arr: Array<Entity>) => number;

} = {

    averageAge: (arr) => arr.reduce((total, entity) => total += entity.age(), 0) / arr.length,
    averageMaxAge: (arr) => arr.reduce((total, entity) => total += entity.options().maxAge, 0) / arr.length, 
    averageSpeed: (arr) => arr.reduce((total, entity) => total += entity.options().speed, 0) / arr.length,
    averageMaxForceMagnitude: (arr) => arr.reduce((total, entity) => total += entity.options().maxForce.magnitude, 0) / arr.length,
    averageMaxForceAngle: (arr) => arr.reduce((total, entity) => total += entity.options().maxForce.angle, 0) / arr.length,
    averagePerceptionRadius: (arr) => arr.reduce((total, entity) => total += entity.options().perception.radius, 0) / arr.length,
    averagePerceptionAngle: (arr) => arr.reduce((total, entity) => total += entity.options().perception.angle, 0) / arr.length,
    averageHunger: (arr) => arr.reduce((total, entity) => total += entity.hunger(), 0) / arr.length,
    averageHungerDecay: (arr) => arr.reduce((total, entity) => total += entity.options().hungerDecay, 0) / arr.length,
    averageEatingThreshold: (arr) => arr.reduce((total, entity) => total += entity.options().eatingThreshold, 0) / arr.length,
    averageHealth: (arr) => arr.reduce((total, entity) => total += entity.options().health, 0) / arr.length,
    averageHealthDelta: (arr) => arr.reduce((total, entity) => total += entity.options().healthDelta, 0) / arr.length,
    averageReproductionInterval: (arr) => arr.reduce((total, entity) => total += entity.options().reproductionInterval, 0) / arr.length,
    averageAlignmentModifier: (arr) => arr.reduce((total, entity) => total += entity.options().flockingModifier.alignment, 0) / arr.length,
    averageCohesionModifier: (arr) => arr.reduce((total, entity) => total += entity.options().flockingModifier.cohesion, 0) / arr.length,
    averageSeparationModifier: (arr) => arr.reduce((total, entity) => total += entity.options().flockingModifier.separation, 0) / arr.length
};

function useEntities(simState: SimState, pollingRate: number): EntityStats {

    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);
    const [stats, setStats] = useState<EntityStats["stats"]>({

        count: [],
        averageAge: [],
        averageMaxAge: [],
        averageSpeed: [],
        averageMaxForceMagnitude: [],
        averageMaxForceAngle: [],
        averagePerceptionRadius: [],
        averagePerceptionAngle: [],
        averageHunger: [],
        averageHungerDecay: [],
        averageEatingThreshold: [],
        averageHealth: [],
        averageHealthDelta: [],
        averageReproductionInterval: [],
        averageAlignmentModifier: [],
        averageCohesionModifier: [],
        averageSeparationModifier: []
    });
    
    const update = useCallback(() => setStats(previous => {

        if(!simRunning || simState.time.delta.current === 0) return previous;

        const stamp = Math.round(simState.time.elapsed.current / 1000);

        const entities = simState.entities.context.current.entities();

        const predators: Array<Entity> = [];
        const preys: Array<Entity> = [];

        entities.data().forEach((entity) => {

            switch(entity.type()) {

                case "predator": 

                    predators.push(entity);
                    return;

                case "prey":

                    preys.push(entity);
                    return;
            }
        });

        const predatorCount = predators.length;
        const preyCount = preys.length;

        const newStats: EntityStats["stats"] = {

            count: [ ...previous.count, { predators: predatorCount, preys: preyCount, stamp } ],
            averageAge: [],
            averageMaxAge: [],
            averageSpeed: [],
            averageMaxForceMagnitude: [],
            averageMaxForceAngle: [],
            averagePerceptionRadius: [],
            averagePerceptionAngle: [],
            averageHunger: [],
            averageHungerDecay: [],
            averageEatingThreshold: [],
            averageHealth: [],
            averageHealthDelta: [],
            averageReproductionInterval: [],
            averageAlignmentModifier: [],
            averageCohesionModifier: [],
            averageSeparationModifier: []
        };

        const maxSamples = 1000;

        if(newStats.count.length > maxSamples) {

            newStats.count.splice(0, 1);
        }

        let statType: keyof typeof averageCalculators;

        for(statType in averageCalculators) {

            const averageCalculator = averageCalculators[statType];

            newStats[statType] = [

                ...previous[statType],
                {   predators: predatorCount > 0 ? averageCalculator(predators) : 0, 
                    preys: preyCount > 0 ? averageCalculator(preys) : 0, 
                    stamp }
            ];

            if(newStats[statType].length > maxSamples) {

                newStats[statType].splice(0, 1);
            }
        }

        return newStats;

    }), [simState.entities.context, simState.time.delta, simRunning, simState.time.elapsed]);

    useEffect(() => {

        const id = window.setInterval(update, pollingRate);

        return () => {

            window.clearInterval(id);
        }

    }, [pollingRate, update]);

    const clearStats = () => {

        setStats({

            count: [],
            averageAge: [],
            averageMaxAge: [],
            averageSpeed: [],
            averageMaxForceMagnitude: [],
            averageMaxForceAngle: [],
            averagePerceptionRadius: [],
            averagePerceptionAngle: [],
            averageHunger: [],
            averageHungerDecay: [],
            averageEatingThreshold: [],
            averageHealth: [],
            averageHealthDelta: [],
            averageReproductionInterval: [],
            averageAlignmentModifier: [],
            averageCohesionModifier: [],
            averageSeparationModifier: []

        });
    };
    
    return {

        stats,
        clearStats
    };
}

export function useStatsState(): StatsState {

    const simState = useContext(SimStateContext);

    const fps = useFps(simState, 100);
    const entities = useEntities(simState, 500);

    return {

        fps,
        entities
    };
}