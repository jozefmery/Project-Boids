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
import { Theme } from "../stylers";
import { Languages } from "../lang/all";
import { SimZoomTarget } from "../components/Simulation";

// import key binding types
import { SimulationBindings } from "../components/Simulation";

// gather all possible key binding into a single type
export type Bindings = SimulationBindings;

export type StateShape = {

    sim: {

        running: boolean;

        area: {

            x: number;
            y: number;
        };

        camera: {

            scale: {

                min: number;
                max: number;
                delta: number;
                enabled: boolean;
                target: SimZoomTarget;
            }

            moveDelta: number;
        }

        grid: {

            draw: boolean;
            intensity: number;
            highlight: number;
        }
    };

    language: Languages;

    theme: Theme;

    keyboard: {

        bindings: {

            [binding in Bindings]: string;
        }

        // hotkeys: {

        // }
    }
};

const defaultState: StateShape =  {

    sim: {

        running: false,    
        
        area: {

            x: 500, 
            y: 500 
        },
        
        camera: {

            scale: {
                
                min: 0.5,
                max: 1.5,
                delta: 0.05,
                enabled: true,
                target: SimZoomTarget.CURSOR
            },
            
            moveDelta: 250 
        },
    
        grid: {
    
            draw: true,
            intensity: 50,
            highlight: 5
        }
    },

    language: Languages.EN,

    theme: Theme.DARK,

    keyboard: {

        bindings: {

            "moveCameraLeft":   "a",
            "moveCameraUp":     "w",
            "moveCameraRight":  "d",
            "moveCameraDown":   "s",
        },

        // hotkeys: {


        // }
    }
}

export default defaultState;