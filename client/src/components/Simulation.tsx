/**
 * File: Simulation.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Simulation implementation, including drawing using p5 library.
 * 
 */

// import dependencies
import React, { Component } from "react";
import P5 from "p5";
import classNames from "classnames";

// import utilities
import { clamp } from "../utils";

// import custom components
import P5Sketch from "./P5Sketch";

// import react-redux
import { connect } from "react-redux";
 
// import stylers
import stylers from "../stylers";

// import hotkeys
import { HotkeyEvent, HotKeyContext } from "../hotkeys";

// import type information
import { StateShape } from "../state/defaultState";

interface GridLineOptions {

    intensity: number;
    boundary: number;
    highlight: number;
    getCoordinates: (_: number) => { x1: number, x2: number, 
                            y1: number, y2: number };
};

type SimulationProps = Pick<StateShape, "sim" | "theme" | "keyboard"> & {

    parentClasses?: Parameters<typeof classNames>[0];
    parentID: string;
};

export enum SimZoomTarget {

    CURSOR,
    CENTER
};

class Simulation extends Component<SimulationProps, { mouseDragging: boolean, zoomModifier: number }> {

    /// Public static members

    public static readonly defaultProps = {

        parentClasses: "",
        parentID: ""
    }

    public static readonly bindingList = [

        "moveCameraLeft",
        "moveCameraUp",      
        "moveCameraRight",   
        "moveCameraDown"

    ] as const;

    /// Public static methods

    public static stateToProps = ({ sim, theme, keyboard }: StateShape) => ({ sim, theme, keyboard });

    /// Protected members

    // references will be initialized in setup
    protected p5: P5 = null as any;
    protected parent: HTMLElement = null as any;

    protected timeStamp: number;
    protected timeDelta: number;

    protected hotkeys: HotKeyContext;

    protected camera: { x: number, 
                        y: number, 
                        scale: number };

    protected mouse: { lastX: number, lastY: number };

    protected timeouts: {

        // add index signature to enable looping
        [index: string]: number;
        zooming: number;
        updateFPS: number;
    };

    protected fps: number;
    
    protected bindings: {

        [binding in SimulationBindings]: () => void;
        
    } = {} as any;

    /// Constructor function

    public constructor(props: SimulationProps) {

        super(props);

        this.state = {
            mouseDragging: false,
            zoomModifier: 0
        };

        // setup timing variables
        this.timeStamp = new Date().getTime();
        this.timeDelta = 16.7;

        this.hotkeys = new HotKeyContext();

        this.camera = { x: 0, y: 0, scale: 1.0 };

        this.mouse = {

            lastX: 0,
            lastY: 0
        };

        this.timeouts = {

            zooming: 0,
            updateFPS: 0
        };

        this.fps = 0;

        this.setupHotkeys();
        this.setupKeyBindings();

        // initiate fps update loop
        this.updateFPS();
    }

    /// Protected methods

    // setup methods

    protected setupHotkeys(): void {

        this.hotkeys.attachBlurHandlerToWindow();
    }

    protected setupKeyBindings(): void {

        this.bindings.moveCameraLeft = () => this.moveCamera(-this.getCameraMoveDelta(), 0);
        this.bindings.moveCameraUp = () => this.moveCamera(0, -this.getCameraMoveDelta());
        this.bindings.moveCameraRight = () => this.moveCamera(this.getCameraMoveDelta(), 0);;
        this.bindings.moveCameraDown = () => this.moveCamera(0, this.getCameraMoveDelta());
    }

    protected /* p5 */ setup = (p5: P5, parent: HTMLElement): void => {

        // setup references
        this.p5 = p5;
        this.parent = parent;

        // create canvas with current parent size
        this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight).parent(this.parent);

        this.moveToAreaCenter();
    }

    // event handler methods

    protected windowResizedHandler = (): void => {

        // resize canvas when parent div is resized
        this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
    }

    protected keyDownHandler = (event: React.KeyboardEvent): void => {

        if(event.repeat) return;

        this.hotkeys.onKeyChanged(event.nativeEvent, true);
    }

    protected keyUpHandler = (event: React.KeyboardEvent): void => {

        this.hotkeys.onKeyChanged(event.nativeEvent, false)
    }

    protected mouseDownHandler = (event: React.MouseEvent): void => {

        this.setState({ mouseDragging: true });
        this.mouse.lastX = event.clientX;
        this.mouse.lastY = event.clientY;
    }
    
    protected mouseUpHandler = (event: React.MouseEvent): void => {
        
        this.setState({ mouseDragging: false });
    }

    protected mouseMoveHandler = (event: React.MouseEvent): void => {

        if(this.state.mouseDragging) {

            this.mouseDragHandler(event);
        }
    }

    protected mouseDragHandler = (event: React.MouseEvent): void => {

        const dx = this.mouse.lastX - event.clientX;
        const dy = this.mouse.lastY - event.clientY;

        this.moveCamera(dx, dy);

        this.mouse.lastX = event.clientX;
        this.mouse.lastY = event.clientY;
    }

    protected mouseLeaveHandler = (event: React.MouseEvent): void => {

        this.setState({ mouseDragging: false });
    }

    protected mouseWheelHandler = (event: React.WheelEvent): void => {

        // --- shorthands
        const scale = this.props.sim.camera.scale;
        const { clientX, clientY, deltaY } = event;
        // --- shorthands

        if(!scale.enabled) return;

        let targetX, targetY = 0;

        switch(scale.target) {

            case SimZoomTarget.CURSOR:

                targetX = clientX;
                targetY = clientY;
                break;
            
            case SimZoomTarget.CENTER:

                targetX = this.p5.windowWidth / 2;
                targetY = this.p5.windowHeight / 2;
        }

        // ignore non-standard value
        // wheel-up = negative value - should increase zoom
        // wheel-down = positive value - should decrease zoom
        // invert sign to achieve desired behavior
        const zoomModifier = -Math.sign(deltaY);
        
        this.showZoomCursor(zoomModifier);        

        const newScale = clamp(this.camera.scale + (scale.delta * zoomModifier), scale.min, scale.max);
        const scaleDelta = newScale - this.camera.scale;

        this.adjustCamera(targetX, targetY, scaleDelta);

        this.camera.scale = newScale;
    }

    // query methods

    protected getCameraMoveDelta(): number {

        return (this.props.sim.camera.moveDelta / 1000) * this.timeDelta * this.camera.scale;
    }
    
    // mutator methods

    protected moveToAreaCenter() {

        // --- shorthands
        const camera = this.camera;
        const p5 = this.p5;
        const area = this.props.sim.area;
        // --- shorthands

        camera.x = (- p5.windowWidth / 2) + area.x / 2;
        camera.y = (- p5.windowHeight / 2) + area.y / 2 ;
    }

    protected showZoomCursor(zoomModifier: number): void {

        this.setState({ ...this.state, zoomModifier });
        clearTimeout(this.timeouts.zooming);
        this.timeouts.zooming = setTimeout(() => this.setState({ ...this.state, zoomModifier: 0 }), 400) as any;
    }

    protected adjustCamera(targetX: number, targetY: number, scaleDelta: number): void {

        this.moveCamera(((targetX + this.camera.x) / this.camera.scale) * scaleDelta, 
                        ((targetY + this.camera.y) / this.camera.scale) * scaleDelta);
    }

    protected moveCamera(x: number, y: number): void {

        this.camera.x += x;
        this.camera.y += y;
    }

    // update methods

    protected updateFPS(): void {

        // update fps once every second
        this.timeouts.updateFPS = window.setTimeout(() => this.updateFPS(), 500);

        this.fps = Math.round(1000 / this.timeDelta);
    }

    protected updateTimeData(): void {

        const last = this.timeStamp;
        this.timeStamp = new Date().getTime();
        this.timeDelta = this.timeStamp - last;
    }

    protected runKeyBindings(): void {

        // --- shorthands
        const bindings = this.props.keyboard.bindings;
        // --- shorthands

        for(const action of Simulation.bindingList) {

            const combination = bindings[action];

            if(this.hotkeys.isCombinationPressed(combination)) {

                this.bindings[action]();
            }
        }
    }

    protected update(): void {

        this.updateTimeData();
        this.runKeyBindings();
    }

    protected /* p5 */ loop = (): void => {

        this.update();
        this.draw();
    }

    // drawing

    protected draw(): void {

        this.p5.push();
        this.drawBackground();
        this.applyTransform();
        this.drawArea();
        this.drawGrid();
        this.drawBoundingBox();
        this.p5.pop();
        this.drawFPS();
    }
    
    protected drawBackground(): void {
        
        // --- shorthands 
        const styler = stylers[this.props.theme];
        // --- shorthands
        
        styler.background(this.p5);
    }
    
    protected applyTransform(): void {

        // --- shorthands 
        const p5 = this.p5;
        // --- shorthands

        p5.translate(-this.camera.x, -this.camera.y);
        this.p5.scale(this.camera.scale);
    }
    
    protected drawArea(): void {

        // --- shorthands 
        const p5 = this.p5;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.area(p5);
        
        p5.rect(0, 0, area.x, area.y)
    }

    protected drawGrid(): void {

        // --- shorthands 
        const grid = this.props.sim.grid;
        const area = this.props.sim.area;
        // --- shorthands

        if(!grid.draw) return;

        this.drawGridLines({ intensity: grid.intensity, boundary: area.x,
                             highlight: grid.highlight,
                             getCoordinates: (x: number) => ({ x1: x, y1: 0, x2: x, y2: area.y })
        });

        this.drawGridLines({ intensity: grid.intensity, boundary: area.y,
                             highlight: grid.highlight,
                             getCoordinates: (y: number) => ({ x1: 0, y1: y, x2: area.x, y2: y })
        });

    }

    protected drawGridLines(options: GridLineOptions): void {

        // --- shorthands 
        const p5 = this.p5;
        const styler = stylers[this.props.theme]; 
        // --- shorthands

        styler.grid(this.p5);

        for(let i = 0; i * options.intensity < options.boundary; i++) {
            
            p5.push();

            if(options.highlight && (i % options.highlight === 0)) {
                
                styler.gridHighlight(p5);
            }
            
            let coord = options.getCoordinates(i * options.intensity);
            p5.line(coord.x1, coord.y1, coord.x2, coord.y2);
            
            p5.pop();
        }
    }

    protected drawBoundingBox(): void {

        // --- shorthands
        const p5 = this.p5;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.boundingBox(p5);
        
        p5.rect(0, 0, area.x, area.y)
    }

    protected drawFPS(): void {

        // --- shorthands
        const p5 = this.p5;
        // --- shorthands

        p5.textAlign(p5.RIGHT);
        p5.textSize(15);
        p5.fill(255);
        p5.text(`FPS: ${this.fps}`, p5.windowWidth - 10, p5.windowHeight - 10);
    }

    /// Public methods

    public componentWillUnmount(): void {

        this.hotkeys.clearBlurHandler();

        // clear all timeouts
        for(const timeout in this.timeouts) {

            window.clearTimeout(this.timeouts[timeout]);
        }
    }

    public /* react */ render(): JSX.Element {

        return <P5Sketch id={this.props.parentID} 
                        classNames={classNames(this.props.parentClasses, 
                                    {   "dragging": this.state.mouseDragging,  
                                        "zoom-in": this.state.zoomModifier === 1,
                                        "zoom-out": this.state.zoomModifier === -1,
                                })}
                        setup={this.setup}
                        draw={this.loop} 
                        windowResized={this.windowResizedHandler}
                        onKeyDown={this.keyDownHandler}
                        onKeyUp={this.keyUpHandler}
                        onMouseDown={this.mouseDownHandler}
                        onMouseUp={this.mouseUpHandler}
                        onMouseMove={this.mouseMoveHandler}
                        onMouseLeave={this.mouseLeaveHandler}
                        onWheel={this.mouseWheelHandler}
                        />;
    }
}

export type SimulationBindings = typeof Simulation.bindingList[number];

export default connect(Simulation.stateToProps)(Simulation);