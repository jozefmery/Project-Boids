/**
 * File: defaultState.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.1.2020
 * License: none
 * Description: Defines the shape of the whole application state with default values.
 * 
 */

export default {

    sim: {

        // running
        running: false,    
        
        // area
        area: {

            x: 500, 
            y: 500 
        },
        
        // camera
        camera: {

            scale: {
                
                min: 0.5,
                max: 1.5,
                delta: 0.05
            },
            
            moveDelta: 250 
        },
    
        // grid
        grid: {
    
            draw: true,
            intensity: 50,
            highlight: 5
        }
    },

    language: "en",

    theme: "dark"
}