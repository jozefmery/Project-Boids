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

/**
 * 
 * Enum representing the possible global application themes, with values representing assigned class names.
 */
export enum Theme {

    LIGHT = "light",
    DARK = "dark"
}

/**
 * 
 * List of properties every styler requires.
 */
type stylerList =   "background"    |
                    "area"          |
                    "grid"          |
                    "gridHighlight" |
                    "boundingBox";

/**
 * 
 * Plain object type which contains every styler function from styler list.
 */
type Styler = {

    [styler in stylerList]: (p5: P5) => void;
}

/**
 * 
 * Plain object type which contains a Styler object for every theme.
 */
type IStylers = {

    [theme in Theme]: Styler;
}

/**
 * 
 * Styler implementations for every theme.
 */
const stylers: IStylers = {

    [Theme.DARK]: {

        background: (p5) => p5.background(70),
        
        area: (p5) => {
            
            p5.fill(40);
            p5.noStroke();
        },

        grid: (p5) => {

            p5.stroke(120);
            p5.strokeWeight(1);
        },

        gridHighlight: (p5) => p5.strokeWeight(2),
        
        boundingBox: (p5) => {

            p5.noFill();
            p5.stroke(59, 85, 128);
            p5.strokeWeight(3);
        }
    },

    [Theme.LIGHT]: {

        background: (p5) => p5.background(200),

        area: (p5) => {
            
            p5.fill(220);
            p5.noStroke();
        },

        grid: (p5) => {

            p5.stroke(150);
            p5.strokeWeight(1);
        },

        gridHighlight: (p5) => p5.strokeWeight(2),

        boundingBox: (p5) => {

            p5.noFill();
            p5.stroke(30);
            p5.strokeWeight(3);
        }
    },
};

export default stylers;