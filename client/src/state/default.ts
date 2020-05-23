/**
 * File: state/default.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: Defines the default values for the app state.
 * 
 */

// import type information 
import { StateShape } from "../types/redux";
import { ColorTheme } from "../types/stylers";
import { Languages } from "../lang/all";
import { SimZoomTarget } from "../types/simulation";
import { EventType } from "@dodmeister/hotkeys";

const defaultState: StateShape =  {

    global: {

        language: Languages.EN,

        theme: ColorTheme.DARK,

        dimensions: { width: 0, height: 0 },

        sidePanel: "setup"
    },

    sim: {

        speed: {

            running: false,
            current: 3.0,
            min: 0.1,
            max: 5.0,
            delta: 0.1
        },
        
        area: {

            width: 2000, 
            height: 2000 
        },
        
        camera: {

            scale: {
                
                current: 1.0,
                min: 0.1,
                max: 3,
                delta: 0.05,
                enabled: true,
                target: SimZoomTarget.CURSOR
            },

            movement: {

                up: false,
                right: false,
                down: false,
                left: false
            },
            
            moveDelta: 2000,

            target: { x: 0, y: 0 },

            minVisibleArea: 150
        },
    
        grid: {
    
            draw: true,
            intensity: 50,
            highlight: 5
        }
    },

    hotkeys: {

        toggleTheme: {

            sequences: "t"
        },
        cycleLanguages: {

            sequences: "l"
        },

        toggleSimRunning: {

            sequences: "space",
            preventDefault: true
        },
        increaseSimSpeed: {

            sequences: "="
        },
        decreaseSimSpeed: {

            sequences: "-"
        },
        zoomIn: {

            sequences: "shift+=",
        },
        zoomOut: {

            sequences: "shift+-"
        },
        centerCameraToArea: {

            sequences: "alt+c"
        },
        setCameraMoveUp: {

            sequences: "w",
            eventType: EventType.KEYDOWN,
            exactMatch: false
        },
        resetCameraMoveUp: {

            sequences: "w",
            eventType: EventType.KEYUP,
            exactMatch: false,
        },
        setCameraMoveRight: {

            sequences: "d",
            eventType: EventType.KEYDOWN,
            exactMatch: false
        },
        resetCameraMoveRight: {

            sequences: "d",
            eventType: EventType.KEYUP,
            exactMatch: false,
        },
        setCameraMoveDown: {

            sequences: "s",
            eventType: EventType.KEYDOWN,
            exactMatch: false
        },
        resetCameraMoveDown: {

            sequences: "s",
            eventType: EventType.KEYUP,
            exactMatch: false,
        },
        setCameraMoveLeft: {

            sequences: "a",
            eventType: EventType.KEYDOWN,
            exactMatch: false
        },
        resetCameraMoveLeft: {

            sequences: "a",
            eventType: EventType.KEYUP,
            exactMatch: false,
        },
        toggleStatsOpen: {

            sequences: "e"
        },
        toggleSimSetupOpen: {

            sequences: "q"
        },
        toggleAboutOpen: {

            sequences: "i"
        }
    }
}

export default defaultState;