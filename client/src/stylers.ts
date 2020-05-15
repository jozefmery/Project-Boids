/**
 * File: stylers.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 3.3.2020
 * License: none
 * Description: Defines styling functions for various themes used during rendering.
 * 
 */

// import react hooks
import { useCallback } from "react";

// import redux utilities
import { useSelector } from "react-redux";

// import p5
import P5 from "p5";

// import utils
import lodash from "lodash";

// import MUI stylers
import { StyleRules } from "@material-ui/styles/withStyles";

// import type information
import { StateShape } from "./types/redux";

/**
 * 
 * Enum representing the possible global application themes.
 */
export enum ColorTheme {

    LIGHT = "light",
    DARK = "dark"
}

/**
 * 
 * Array of Theme enum values.
 */
export const themeList = Object.values(ColorTheme);

/**
 * 
 * Extended Material UI theme with a custom variable
 * representing the global theme.
 */
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {

        theme: ColorTheme;
    }
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        
        theme?: ColorTheme;
    }
}

/**
 * 
 * List of properties every styler requires.
 */
export type SimStylerList =    
                        "background"
                    |   "area"
                    |   "grid"
                    |   "gridHighlight" 
                    |   "boundingBox"
                    |   "prey"
                    |   "preyHighlight"
                    |   "predator"
                    |   "predatorHighlight"
                    |   "food"
                    |   "entityPerception"
                    |   "entityPercived"
                    |   "quadtree"
                    |   "forceBackground"
                    |   "forceCircle"
                    |   "forceArrow";

/**
 * 
 * Plain object type which contains every styler function from styler list.
 */
type SimStyler = {

    [styler in SimStylerList]: (p5: P5) => void;
}

/**
 * 
 * Plain object type which contains a Styler object for every theme.
 */
type SimStylers = {

    [theme in ColorTheme]: SimStyler;
}

/**
 * 
 * Styler implementations for every theme.
 */
export const simStylers: SimStylers = {

    [ColorTheme.DARK]: {

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
            p5.stroke(140);
            p5.strokeWeight(2);
        },

        prey: (p5) => {

            p5.fill(255);
            p5.stroke(0);
            p5.strokeWeight(2);
        },

        preyHighlight: (p5) => {

            p5.fill("#ffc927");
            p5.stroke(0);
            p5.strokeWeight(2);
        },

        predator: (p5) => {

            // TODO
        },

        predatorHighlight: (p5) => {

            // TODO
        },

        food: (p5) => {

            // TODO
            p5.stroke("red");
            p5.strokeWeight(3);
        },

        entityPerception: (p5) => {

            p5.noStroke();
            p5.fill(255, 255, 255, 60);
        },

        entityPercived: (p5) => {

            p5.strokeWeight(1);
            p5.stroke(255, 0, 0, 100);
            p5.noFill();
        },

        quadtree: (p5) => {

            p5.noFill();
            p5.stroke("yellow");
            p5.strokeWeight(1);
        },

        forceBackground: (p5) => {

            p5.background("#353535")
        },

        forceCircle: (p5) => {

            p5.fill("#292929");
            p5.noStroke();
        },

        forceArrow: (p5) => {

            p5.fill("#801313");
            p5.stroke("#801313");
            p5.strokeWeight(3);
        }
    },

    [ColorTheme.LIGHT]: {

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
        },
        
        prey: (p5) => {

            p5.fill("#00da09");
            p5.stroke(0);
            p5.strokeWeight(2);
        },

        preyHighlight: (p5) => {

            p5.fill("#ffc927");
            p5.stroke(0);
            p5.strokeWeight(2);
        },

        predator: (p5) => {

            // TODO
        },

        predatorHighlight: (p5) => {

            // TODO
        },

        food: (p5) => {

            // TODO
            p5.stroke("red");
            p5.strokeWeight(3);
        },

        entityPerception: (p5) => {

            p5.noStroke();
            p5.fill(0, 0, 0, 60);
        },

        entityPercived: (p5) => {

            p5.strokeWeight(1);
            p5.stroke(255, 0, 0, 100);
            p5.noFill();
        },

        quadtree: (p5) => {

            p5.noFill();
            p5.stroke("#d63aff");
            p5.strokeWeight(2);
        },

        forceBackground: (p5: P5) => {

            p5.background("white")
        },

        forceCircle: (p5) => {

            p5.fill("#afafaf");
            p5.noStroke();
        },

        forceArrow: (p5) => {

            p5.fill("black");
            p5.stroke("black");
            p5.strokeWeight(3);
        }
    },
};

export function useCanvasStylers(styler: SimStylerList) {

    const theme = useSelector((state: StateShape) => state.global.theme);

    return useCallback((p5: P5) => {

        simStylers[theme][styler](p5);

    }, [theme, styler]);
}

type StyleDefinition = StyleRules<any>[string];

type ThemedStyleDefinition = {

    [theme in ColorTheme]?: StyleDefinition;
};

type NoUndefinedField<T> = { [P in keyof T]-?: NonNullable<T[P]> };

export class Style {

    /// Public static members

    public static readonly horizontalFlexBox = Style.create({

        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center"
    });

    public static readonly verticalFlexBox = Style.create({

        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center"
    });
        
    public static readonly panelBackground = Style.create({}, {

        [ColorTheme.DARK]: { backgroundColor: "#292929" },
    
        [ColorTheme.LIGHT]: { backgroundColor: "#8bbcff" }
    });

    public static readonly panel = Style.create({
            
        borderWidth: "1px"
    
    }, {
    
        [ColorTheme.DARK]: {
            
            borderColor: "#801313",

            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)"
        },
    
        [ColorTheme.LIGHT]: {
            
            borderColor: "black",

            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
        }

    }, Style.panelBackground);

    public static readonly textColor = Style.create({}, {

        [ColorTheme.DARK]: { color: "#cecece" },
    
        [ColorTheme.LIGHT]: { color: "black" }
    });

    public static readonly topBarButton = Style.create({

        // override default
        minWidth: "0px", 

        // border
        borderRadius: "50%",
        
        // spacing
        padding: "10px",
        margin: "10px 3px",

        // icon
        "& svg": {

            fontSize: "30px"
        }
    
    }, {
    
        [ColorTheme.DARK]: {

            "&:hover": {

                backgroundColor: "#1d1d1d"
            }
        },
    
        [ColorTheme.LIGHT]: {

            "&:hover": {

                backgroundColor: "#b9d5ff"
            }
        }

    }, Style.textColor);

    public static readonly controlButton = Style.create({

        // override default
        minWidth: "0px",
        
        // border
        borderRadius: "3px",
        
        // spacing
        padding: "5px",
        
        // icon
        "& *": {

            fontSize: "20px"
        }
    
    }, {
    
        [ColorTheme.DARK]: {

            border: "1px #a8a8a8 solid",

            "&:hover": {

                backgroundColor: "#1d1d1d"
            }
        },

        [ColorTheme.LIGHT]: {

            border: "1px black solid",

            "&:hover": {

                backgroundColor: "#b9d5ff"
            }
        }

    }, Style.textColor);

    public static readonly tooltip = Style.create({

        padding: "5px 10px",
        fontSize: "15px",
        boxShadow: "0px 0px 5px black"
    
    }, {

        [ColorTheme.DARK]: {

            color: "black",
            backgroundColor: "white"

        },

        [ColorTheme.LIGHT]: {

            color: "white",
            backgroundColor: "black"
        }
    });

    public static menu = Style.create({}, {

        [ColorTheme.DARK]: {

            color: "#cecece",
            backgroundColor: "#313131",
        },

        [ColorTheme.LIGHT]: {

            color: "black",
            backgroundColor: "white"
        }
    });

    public static menuItem = Style.create({

        fontSize: "15px"

    }, {

        [ColorTheme.DARK]: {

            "&:focus, &:focus:hover": {

                backgroundColor: "#464646",
            },

            "&:hover": {

                backgroundColor: "#666666",
            }
        },

        [ColorTheme.LIGHT]: {

            "&:focus, &:focus:hover": {

                backgroundColor: "#c9c9c9",
            },

            "&:hover": {

                backgroundColor: "#e6e6e6",
            }
        }
    });

    /// Protected members

    // members are initialized in ctor using methods 
    protected shared: StyleDefinition = {};
    protected themed: NoUndefinedField<ThemedStyleDefinition> = {

        [ColorTheme.LIGHT]: {},
        [ColorTheme.DARK]: {}
    };

    protected baseStyles: Array<Style> = [];

    /// Constructor function

    protected constructor(sharedProperties:     Readonly<StyleDefinition>, 
                            themedProperties:   Readonly<ThemedStyleDefinition>, 
                            baseStyles:         Readonly<Array<Style>> | Style) {

        this.setSharedCSS(sharedProperties);
        this.setThemedCSS(themedProperties);
        this.setBaseStyles(baseStyles)
    }

    /// Public static methods

    public static create(sharedProperties: StyleDefinition = {}, 
                            themedProperties: Readonly<ThemedStyleDefinition> = {}, 
                            baseStyles: Readonly<Array<Style>> | Style = []): Style {

        return new Style(sharedProperties ? sharedProperties : {}, 
                        themedProperties ? themedProperties : {},
                        baseStyles);
    }

    /// Public methods

    public setSharedCSS(sharedProperties: Readonly<StyleDefinition>): void {

        this.shared = lodash.cloneDeep(sharedProperties);
    }
    
    public setThemedCSS(themedProperties: Readonly<ThemedStyleDefinition>): void {

        this.themed = lodash.merge({

            [ColorTheme.LIGHT]: {},
            [ColorTheme.DARK]: {}

        }, themedProperties);
    }

    public setBaseStyles(baseStyles: Readonly<Array<Style>> | Style): void {

        if(baseStyles instanceof Style) {

            this.baseStyles = [ baseStyles ];

        } else {

            this.baseStyles = [ ...baseStyles ];
        }
    }

    public clearBaseStyles(): void {

        this.setBaseStyles([]);
    }

    public clearSharedCSS(): void {

        this.setSharedCSS({});
    }

    public clearThemedCSS(): void {

        this.setSharedCSS({});
    }

    public compose(theme: ColorTheme): StyleDefinition {

        const baseStyles = this.baseStyles.map(base => base.compose(theme));

        return lodash.merge({}, ...baseStyles, this.shared, this.themed[theme])
    }
};