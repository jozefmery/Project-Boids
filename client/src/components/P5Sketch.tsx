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
import React, { useEffect, useRef } from "react";
import P5 from "p5";
import classNamesFunc from "classnames";

type P5SketchProps = {

    classNames?: Parameters<typeof classNamesFunc>[0];
    // p5 setup
    preload?: ((p5: P5) => any) | void;
    setup: (p5: P5, parent: HTMLDivElement) => any;
    // p5 events
    draw?: (() => any) | void;
    windowResized?: (() => any) | void;

} & Omit<React.ComponentProps<"div">, "className" | "ref">;

type P5Events = { draw: P5SketchProps["draw"], windowResized: P5SketchProps["windowResized"] };
        
function useP5(preload: P5SketchProps["preload"], events: P5Events) {

    const instance = useRef<P5 | null>(null);

    useEffect(() => {

        instance.current = new P5((p5: P5) => {

            if(preload) {
    
                p5.preload = () => preload(p5);
            }
        });

        return () => {

            if(instance.current) {

                instance.current.remove();
            }
        }

    }, []);

    useEffect(() => {

        if(instance.current) {

            instance.current.draw = events.draw as () => undefined;
            instance.current.windowResized = events.windowResized as () => undefined;
        }

    }, [events.draw, events.windowResized]);

    return instance;
}

export default function P5Sketch({ classNames = "", ...props }: P5SketchProps) {

    const parent = useRef(null);

    const p5 = useP5(props.preload, { draw: props.draw, windowResized: props.windowResized });

    useEffect(() => {

        if(p5.current !== null && parent.current !== null) {

            props.setup(p5.current, parent.current as any);
        }

    }, []);

    const { 
        // extract props which are used elsewhere
        preload,
        setup,
        draw,
        windowResized,
        // extract rest of props 
        ...rest 
    } = props;

    return <div ref={parent} className={classNamesFunc(classNames)}
                // pass rest of props as is
                { ...rest }
                />;
}