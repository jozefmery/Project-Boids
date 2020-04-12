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

// import utils
import lodash from "lodash";

// import MUI stylers
import { CSSProperties } from "@material-ui/styles/withStyles";

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
type SimStylerList =   "background"    |
                    "area"          |
                    "grid"          |
                    "gridHighlight" |
                    "boundingBox";

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
        }
    },
};

type ThemedCSSProperties = {

    [theme in ColorTheme]?: CSSProperties;
};

type NoUndefinedField<T> = { [P in keyof T]-?: NonNullable<T[P]> };

type GlobalStyle = "UIPanel" 
                    | "ColorTransition" 
                    | "ControlButton" 
                    | "VerticalFlexBox" 
                    | "TopBarButton"
                    | "SimpleTooltip";

export class Style {

    /// Protected static members

    protected static globalThemedStyles: { [component in GlobalStyle]: Style } = {

        VerticalFlexBox: Style.create({

            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "space-evenly"
        }),

        ColorTransition: Style.create({

            transition: "background-color .3s linear, color .3s linear, border-color .3s linear",
        }),
        
        UIPanel: Style.create({
            
            borderWidth: "1px",
        }, 
        {
    
            [ColorTheme.DARK]: {
                
                
                borderColor: "#801313",

                boxShadow: "0px 0px 10px rgba(255,255,255,0.1)",
                backgroundColor: "#292929"
            },
        
            [ColorTheme.LIGHT]: {
                
                borderColor: "#801313",

                boxShadow: "0px 0px 10px rgba(255,255,255,0.1)",
                backgroundColor: "#292929"
            }
        }),

        TopBarButton: Style.create({

            minWidth: "0px", // override default
            padding: "10px",
            borderRadius: "50%",

            "& svg": {

                fontSize: "30px"
            }
        }, 
        {
    
            [ColorTheme.DARK]: {
                
                color: "#cecece",

                "&:hover": {
    
                    backgroundColor: "#1d1d1d"
                }
            },
        
            [ColorTheme.LIGHT]: {
                
                color: "#cecece",

                "&:hover": {
    
                    backgroundColor: "#1d1d1d"
                }
            }
        }),

        ControlButton: Style.create({

            // spacing
            padding: "5px",
    
            // style
            borderRadius: "3px",
            
            // icon style
            "& svg": {
    
                fontSize: "45px"
            }
        },
        {
    
            [ColorTheme.DARK]: {
    
                color: "#cecece",
                border: "1px #a8a8a8 solid",
    
                "&:hover": {
    
                    backgroundColor: "#1d1d1d"
                }
            },

            [ColorTheme.LIGHT]: {
    
                color: "#cecece",
                border: "1px #a8a8a8 solid",
    
                "&:hover": {
    
                    backgroundColor: "#1d1d1d"
                }
            }
        }),

        "SimpleTooltip": Style.create({

            padding: "5px 10px",
            fontSize: "15px",
            boxShadow: "0px 0px 5px black"
        },
        {
            [ColorTheme.DARK]: {

                color: "black",
                backgroundColor: "white"

            },
            [ColorTheme.LIGHT]: {

                color: "white",
                backgroundColor: "black"
            },
        })
    };

    /// Protected members

    // members are initialized in ctor using methods 
    protected shared: CSSProperties = {};
    protected themed: NoUndefinedField<ThemedCSSProperties> = {

        [ColorTheme.LIGHT]: {},
        [ColorTheme.DARK]: {}
    };

    protected globalStyles: Array<GlobalStyle> = [];

    /// Constructor function

    protected constructor(sharedProperties:     Readonly<CSSProperties>, 
                            themedProperties:   Readonly<ThemedCSSProperties>, 
                            globalStyles:       Readonly<Array<GlobalStyle>> | GlobalStyle) {

        this.setSharedCSS(sharedProperties);
        this.setThemedCSS(themedProperties);
        this.setGlobalStyles(globalStyles)
    }

    /// Public static methods

    public static create(sharedProperties?: CSSProperties, 
                            themedProperties?: Readonly<ThemedCSSProperties>, 
                            globalStyles: Readonly<Array<GlobalStyle>> | GlobalStyle = []): Style {

        return new Style(sharedProperties ? sharedProperties : {}, 
                        themedProperties ? themedProperties : {},
                        globalStyles);
    }

    /// Public methods

    public setSharedCSS(sharedProperties: Readonly<CSSProperties>): void {

        this.shared = lodash.cloneDeep(sharedProperties);
    }
    
    public setThemedCSS(themedProperties: Readonly<ThemedCSSProperties>): void {

        this.themed = lodash.merge({

            [ColorTheme.LIGHT]: {},
            [ColorTheme.DARK]: {}

        }, themedProperties);
    }

    public setGlobalStyles(globalStyles: Readonly<Array<GlobalStyle>> | GlobalStyle): void {

        if(typeof globalStyles === "string") {

            this.globalStyles = [ globalStyles ];

        } else {

            this.globalStyles = [ ...globalStyles ];
        }
    }

    public clearGlobalStyles(): void {

        this.globalStyles = [];
    }

    public clearSharedCSS(): void {

        this.setSharedCSS({});
    }

    public clearThemedCSS(): void {

        this.setSharedCSS({});
    }

    public compose(theme: ColorTheme): CSSProperties {

        const globals = this.globalStyles.map(global => Style.globalThemedStyles[global].compose(theme));

        return lodash.merge({}, ...globals, this.shared, this.themed[theme])
    }
};