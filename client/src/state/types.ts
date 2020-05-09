/**
 * File: types.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 24.4.2020
 * License: none
 * Description: Defines the shape of the whole application state and other helper types.
 * 
 */

// import type information
import { ThunkAction, Action as ReduxAction } from "@reduxjs/toolkit";

import { EventType } from "@dodmeister/hotkeys";
import { Dimensions2D, Position2D } from "../types";
import { SimZoomTarget } from "../components/SimulationTypes";
import { ColorTheme } from "../stylers";
import { Languages } from "../lang/all";
import { Action } from "../actions";
import { EntityType } from "../entities/entity";

type Sequences = string | Array<string>;

type SelectedEntity = {

    type: EntityType;
    id: string;
    position: Position2D;
    velocity: Position2D;
    acceleration: Position2D;
    health: number;
}

export type ActionHotkeys = {

    [action in Action]?: {

        sequences: Sequences;
        eventType?: EventType;
        enabled?: boolean;
        exactMatch?: boolean;
        preventDefault?: boolean;
    };
};

export type StateShape = {

    global: {

        language: Languages;

        theme: ColorTheme;

        dimensions: Dimensions2D;
    };

    sim: {

        speed: {

            running: boolean;
            current: number;
            min: number;
            max: number;
            delta: number;
        };

        area: Dimensions2D;

        camera: {

            scale: {

                current: number;
                min: number;
                max: number;
                delta: number;
                enabled: boolean;
                target: SimZoomTarget;
            };

            movement: {

                up: boolean;
                right: boolean;
                down: boolean;
                left: boolean;
            };

            moveDelta: number;

            target: Position2D;

            minVisibleArea: number;
        };

        grid: {

            draw: boolean;
            intensity: number;
            highlight: number;
        };
    };

    hotkeys: ActionHotkeys;

    stats: {

        open: boolean;

        fps: {
            
            pollingRate: number;
            current: number;
        },

        entities: {
            
            pollingRate: number;
            selected: SelectedEntity | undefined;
            predatorCount: number;
            preyCount: number;
        };
    };
};

export type Thunk = ThunkAction<void, StateShape, unknown, ReduxAction<string>>;