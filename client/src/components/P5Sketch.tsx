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

const P5Events = [

    "draw",
    "windowResized",
    "mouseWheel",
    "mouseClicked",
    "doubleClicked",
    "mousePressed",
    "mouseReleased",
    "mouseMoved",
    "mouseDragged",
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

interface EmptyCallback {

    (): void;
}

interface EventCallback<Event> {

    (event: Event): void;
}

type P5SketchProps = {

    classNames?: string | string[];
    id?: string;

    preload?: (p5: P5) => void;
    setup: (p5: P5, parent: HTMLDivElement) => void;
    draw?: EmptyCallback;
    windowResized?: EmptyCallback;
    mouseWheel?: EventCallback<WheelEvent>;
    mouseClicked?: EventCallback<MouseEvent>;
    doubleClicked?: EventCallback<MouseEvent>;
    mousePressed?: EventCallback<MouseEvent>;
    mouseReleased?: EventCallback<MouseEvent>;
    mouseMoved?: EventCallback<MouseEvent>;
    mouseDragged?: EventCallback<MouseEvent>;
    keyPressed?: EventCallback<KeyboardEvent>;
    keyReleased?: EventCallback<KeyboardEvent>;
    keyTyped?: EventCallback<KeyboardEvent>;
    touchStarted?: EventCallback<TouchEvent>;
    touchMoved?: EventCallback<TouchEvent>;
    touchEnded?: EventCallback<TouchEvent>;
    deviceMoved?: EmptyCallback;
    deviceTurned?: EmptyCallback;
    deviceShaken?: EmptyCallback;
};

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

            if(this.props.preload) {

                // create helper reference to satisfy type system
                const callback = this.props.preload;
                p5.preload = () => callback(p5);
            }
            

            p5.setup = () => this.props.setup(p5, this.canvasParent.current as HTMLDivElement);
        });
    }

    private setP5events() {

        P5Events.forEach(event => {

            // cast to function type without parameters or return type
            // to enable looping
            const callback = this.props[event] as () => void;

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