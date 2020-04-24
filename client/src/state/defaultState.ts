/**
 * File: defaultState.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: Defines the shape of the whole application state with default values.
 * 
 */

// import enums
import { ColorTheme } from "../stylers";
import { Languages } from "../lang/all";

// import type information
import { Dimensions2D, Position2D } from "../types";
import { SimulationBindings, SimZoomTarget } from "../components/SimulationDefs";

// gather all possible key binding into a single type
export type Bindings = SimulationBindings;

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

    keyboard: {

        bindings: {

            [binding in Bindings]: string;
        }
    }
};

const defaultState: StateShape =  {

    global: {

        language: Languages.EN,

        theme: ColorTheme.DARK,

        dimensions: { width: 0, height: 0 }
    },

    sim: {

        speed: {

            running: false,
            current: 1.0,
            min: 0.5,
            max: 2.0,
            delta: 0.1
        },
        
        area: {

            width: 1000, 
            height: 1000 
        },
        
        camera: {

            scale: {
                
                current: 1.0,
                min: 0.1,
                max: 10,
                delta: 0.05,
                enabled: true,
                target: SimZoomTarget.CURSOR
            },
            
            moveDelta: 250,

            target: { x: 0, y: 0 },

            minVisibleArea: 150
        },
    
        grid: {
    
            draw: true,
            intensity: 50,
            highlight: 5
        }
    },

    keyboard: {

        bindings: {

            "moveCameraLeft":   "a",
            "moveCameraUp":     "w",
            "moveCameraRight":  "d",
            "moveCameraDown":   "s",
        }
    }
}

export default defaultState;