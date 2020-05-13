// TODO header

// import type information
import React from "react";

export type StatsState = {
    
    fps: {
        array: React.MutableRefObject<Array<{ uv: number }>>;
        current: React.MutableRefObject<number>;
    };

    entities: {

        predators: React.MutableRefObject<{
            count: number;
            array: number[];
        }>;

        preys: React.MutableRefObject<{
            count: number;
            array: number[];
        }>;
    };
};