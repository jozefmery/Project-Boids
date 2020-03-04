/**
 * File: defaultState.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: Defines the shape of the whole application state with default values.
 * 
 */

export default {

    sim: {

        // entities
        entities: {
    
            preys: [],
            predators: [],
            objects: [],
        },
    
        // running
        running: false,    
        
        // area
        area: {

            x: 500, 
            y: 500 
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
            intensity: 50,
            highlight: 5
        }
    },

    controls: {

        keys: {},
        mouse: {

            position: {

                x: undefined,
                y: undefined
            },
            buttons: {} 
        }
    },

    language: "en",

    theme: "light"
}