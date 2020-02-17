/**
 * File: defaultState.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: 
 * 
 */

// import language data for a default language
import languages from "../../lang/all";

export default {

    sim: {

        // entities
        entities: {
    
            preys: [],
            predators: [],
            objects: [],
        },
    
        // state
        state: {
    
            play: false,
            area: { x: 500, y: 500 },
        },
        
        // camera
        camera: {
    
            target: { x: 0, y: 0 },
            scale: {
                
                min: 0.5,
                current: 1.0,
                factor: 0.005,
                max: 1.5
            }
        },
    
        // grid
        grid: {
    
            draw: true,
            intensity: 25,
            highlight: 5
        }
    },

    controls: {
        keyMap: {},
        // mouse: {

        //     x: 0,
        //     y: 0,
        //     dx: 0,
        //     dy: 0,
        //     dz: 0
        // },
    },

    lang: {

        data: languages.en
    }
}