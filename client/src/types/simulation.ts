/**
 * File: types/simulation.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 18.4.2020
 * License: none
 * Description: Defines types for simulation.
 * 
 */

// import type information
import React from "react";
import { Position2D } from "./utils";
import { Context as EntityContext } from "../entities/entity";

export enum SimZoomTarget {

    CURSOR,
    CENTER
};

export type SimState = {

    time: {

        delta: React.MutableRefObject<number>;
        stamp: React.MutableRefObject<number>;
        elapsed: React.MutableRefObject<number>;
        update: () => void;
    };

    camera: {

        zoomModifier: number;
        setZoomModifier: (modifier: number) => void;
    };

    mouse: {

        dragging: boolean;
        setDragging: React.Dispatch<React.SetStateAction<boolean>>;
        lastPosition: React.MutableRefObject<Position2D>;
        setLastPosition: (position: Position2D) => void;
    };

    fps: React.MutableRefObject<number>;

    entities: {
        
        screenToCanvas: ({ x, y }: Position2D) => {
            x: number;
            y: number;
        };
        context: React.MutableRefObject<EntityContext>;
    }
};