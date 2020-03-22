/**
 * File: stylers.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 3.3.2020
 * License: none
 * Description: Defines styling functions for various themes used during rendering.
 * 
 */

// import dependecies
import P5 from "p5";

export default {

    "dark": {

        background: (p5: P5) => p5.background(70),
        
        area: (p5: P5) => {
            
            p5.fill(40);
            p5.noStroke();
        },

        grid: (p5: P5) => p5.stroke(120),
        
        boundingBox: (p5: P5) => {

            p5.noFill();
            p5.stroke(59, 85, 128);
            p5.strokeWeight(3);
        }
    },

    "light": {

        background: (p5: P5) => p5.background(200),

        area: (p5: P5) => {
            
            p5.fill(220);
            p5.noStroke();
        },

        grid: (p5: P5) => p5.stroke(150),

        boundingBox: (p5: P5) => {

            p5.noFill();
            p5.stroke(30);
            p5.strokeWeight(3);
        }
    },
};