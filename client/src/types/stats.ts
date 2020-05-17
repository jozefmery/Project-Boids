/**
 * File: types/stats.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Defines types for statistics.
 * 
 */

// import type information
import React from "react";

export type StatsState = {
    
    fps: {
        array: React.MutableRefObject<Array<{ fps: number }>>;
        current: React.MutableRefObject<number>;
    };

    entities: {

        predators: React.MutableRefObject<number>;
        preys: React.MutableRefObject<number>;

        array: React.MutableRefObject<Array<{ predators: number, preys: number }>>;
    };
};