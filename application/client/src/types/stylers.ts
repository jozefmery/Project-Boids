/**
 * File: types/stylers.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 23.5.2020
 * License: none
 * Description: Extends default MUI theme, defines styler types.
 * 
 */


// import type information
import P5 from "p5";

export enum ColorTheme {

    LIGHT = "light",
    DARK = "dark"
}

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {

        theme: ColorTheme;
    }
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        
        theme?: ColorTheme;
    }
}

export type SimStylerList =    
                        "background"
                    |   "area"
                    |   "grid"
                    |   "gridHighlight" 
                    |   "boundingBox"
                    |   "entity"
                    |   "entityPerception"
                    |   "entityPercived"
                    |   "quadtree"
                    |   "forceBackground"
                    |   "forceCircle"
                    |   "forceArrow";

export type Styler = (p5: P5, ...props: Array<any>) => void;

export type SimStylers = {

    [theme in ColorTheme]: {

        [styler in SimStylerList]: Styler;
    };
}