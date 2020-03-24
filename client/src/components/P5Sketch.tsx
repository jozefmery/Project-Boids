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
import React, { Component } from "react";
import P5 from "p5";
import classNames from "classnames";

type P5SetupCallback = (p5: P5, parent: HTMLDivElement) => void;
type P5Callback = (event?: object) => void;

const P5Events = [
    "draw",
    "windowResized",
    "preload",
    "mouseClicked",
    "doubleClicked",
    "mouseMoved",
    "mousePressed",
    "mouseWheel",
    "mouseDragged",
    "mouseReleased",
    "keyPressed",
    "keyReleased",
    "keyTyped",
    "touchStarted",
    "touchMoved",
    "touchEnded",
    "deviceMoved",
    "deviceTurned",
    "deviceShaken" 
] as const;

type P5EventTypes = {

    [events in typeof P5Events[number]]?: P5Callback;
}

type P5SketchProps = {

    classNames?: string | string[];
    id?: string;

    setup: P5SetupCallback;
    
} & P5EventTypes;

export default class P5Sketch extends Component<P5SketchProps> {

    /// Public static members

    public static defaultProps = {

        classNames: "",
        id: "p5-sketch"
    };

    /// Private members

    private canvasParent: React.RefObject<HTMLDivElement>;
    private p5: P5 = null as any; // initialized after mounting

    /// Constructor function

    public constructor(props: P5SketchProps) {

        super(props);

        this.canvasParent = React.createRef();
    }

    /// Private methods

    private instantiateP5() {

        this.p5 = new P5((p5: P5) => {

            p5.setup = () => {
                
                this.props.setup(p5, this.canvasParent.current as HTMLDivElement);
            };
        });
    }

    private setP5events() {

        P5Events.forEach(event => {

            const callback = this.props[event];

            if(callback) this.p5[event] = callback; 
        });
    }

    /// Public methods

    public componentDidMount() {

        this.instantiateP5();
        this.setP5events();
    }
    
    public componentDidUpdate() {
        
        this.setP5events();
    }

    public componentWillUnmount() {

        this.p5.remove();
    }

    public render() {

        return <div ref={this.canvasParent} className={classNames(this.props.classNames)} id={this.props.id} />;
    }
};