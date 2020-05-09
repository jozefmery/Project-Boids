/**
 * File: P5Sketch.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 24.3.2020
 * License: none
 * Description: Defines a simple p5 wrapper React component.
 * 
 */

// import dependencies
import React, { useEffect, useRef, useState } from "react";
import P5 from "p5";
import ClassNames from "classnames";

// import type information
import { Dimensions2D } from "../types";

type P5Callback = ((p5: P5) => any) | void | undefined;

type P5EventHandlers = {

    preload?: P5Callback;
    setup?: P5Callback;
    loop?: P5Callback;
    cleanup?: P5Callback;
    windowResized?: P5Callback
};

type P5SketchProps = {

    classNames?: Parameters<typeof ClassNames>[0];
    dimensions?: Dimensions2D;

} & P5EventHandlers & Omit<React.ComponentProps<"div">, "className" | "ref">;
     
function useP5({ preload, setup, loop, windowResized, cleanup }: P5EventHandlers, 
                dimensions: Dimensions2D,
                parent: HTMLDivElement | null) {

    const p5 = useRef<P5 | null>(null);

    useEffect(() => {

        // check if parent was already rendered
        if(parent === null) return;

        p5.current = new P5((p5: P5) => {

            if(preload) {

                p5.preload = () => preload(p5);
            }

            p5.setup = () => {

                // create canvas by default
                p5.createCanvas(dimensions.width, dimensions.height).parent(parent);
            
                if(setup) {

                    setup(p5);
                }
            }
        })

        return () => {

            if(p5.current) {

                if(cleanup) {
                    
                    cleanup(p5.current);
                }
                
                p5.current.remove();
            }
        }
    // omit preload, setup from dependency list, 
    // because they are run only once
    // cleanup can't be changed because it would 
    // delete the p5 instance
    // eslint-disable-next-line
    }, [parent]);

    useEffect(() => {

        if(p5.current) {

            p5.current.draw = () => {
                
                if(loop && p5.current) {
                    
                    loop(p5.current)
                }
            } 
            
            p5.current.windowResized = () => {

                if(windowResized && p5.current) {

                    windowResized(p5.current);
                }
            } 
        }
        
    }, [loop, windowResized, parent]);

    useEffect(() => {

        if(p5.current) {

            p5.current.resizeCanvas(dimensions.width, dimensions.height);
        }

    }, [dimensions.width, dimensions.height]);
}

export default function P5Sketch({ classNames = "",
                                    dimensions = { width: 0, height: 0 },
                                    preload, 
                                    setup, 
                                    loop, 
                                    cleanup, 
                                    windowResized, ...props }: P5SketchProps) {

    const parent = useRef<null | HTMLDivElement>(null);

    // force re-rendering after initial render and
    // provide parent to p5 to create a canvas
    const setInitialRender = useState(false)[1];
   
    useEffect(() => setInitialRender(true), [setInitialRender]);

    // provide p5 with event handlers and parent
    useP5({ preload, setup, loop, windowResized, cleanup }, dimensions, parent.current);

    return <div ref={parent} 
                className={ClassNames(classNames)}
                // pass rest of props as is
                { ...props } />;
}