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

type Sequences = string | Array<string>;

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
            }

            moveDelta: number;

            target: Position2D;

            minVisibleArea: number;
        }

        grid: {

            draw: boolean;
            intensity: number;
            highlight: number;
        }
    };

    hotkeys: ActionHotkeys;
};

export type Thunk = ThunkAction<void, StateShape, unknown, ReduxAction<string>>;