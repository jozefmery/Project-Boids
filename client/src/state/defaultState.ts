/**
 * File: defaultState.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: Defines the fault values for the app state.
 * 
 */

// import type information 
import { StateShape } from "./types";
import { ColorTheme } from "../stylers";
import { Languages } from "../lang/all";
import { SimZoomTarget } from "../components/SimulationTypes";

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