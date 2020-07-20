/**
 * File: types/stats.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Defines types for statistics.
 * 
 */

export type FpsStats = {

    array: Array<{ fps: number }>;
    current: number;
}

export const statsTypeList = [

    "count",
    "averageAge",
    "averageMaxAge",
    "averageSpeed",
    "averageMaxForceMagnitude",
    "averageMaxForceAngle",
    "averagePerceptionRadius",
    "averagePerceptionAngle",
    "averageHunger",
    "averageHungerDecay",
    "averageHealth",
    "averageHealthDelta",
    "averageReproductionInterval"
    
] as const;

export type StatTypes = typeof statsTypeList[number];

export type EntityStats = {

    stats: {

        [stat in StatTypes]: Array<{ predators: number, preys: number, stamp: number }>;
    };

    clearStats: () => any;
};

export type StatsState = {
    
    fps: FpsStats;
    entities: EntityStats;
};