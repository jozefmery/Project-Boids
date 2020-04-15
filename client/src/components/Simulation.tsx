/**
 * File: Simulation.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Simulation implementation, including drawing using p5 library.
 * 
 */

// import react
import React, { Component } from "react";

// import utilities
import lodash from "lodash";
import P5 from "p5";

// import custom components
import P5Sketch from "./P5Sketch";

// import react-redux
import { connect } from "react-redux";
 
// import stylers
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { simStylers } from "../stylers";

// import hotkeys
import { HotKeyContext } from "../hotkeys";

// import type information
import { StateShape } from "../state/defaultState";

interface GridLineOptions {

    intensity: number;
    boundary: number;
    highlight: number;
    getCoordinates: (_: number) => { x1: number, x2: number, y1: number, y2: number };
};

type SimulationProps = Pick<StateShape, "sim" | "theme" | "keyboard"> & WithStyles<typeof Simulation.styles>

export enum SimZoomTarget {

    CURSOR,
    CENTER
};

class Simulation extends Component<SimulationProps, { mouseDragging: boolean, zoomModifier: number }> {

    /// Public static members

    public static readonly bindingList = [

        "moveCameraLeft",
        "moveCameraUp",      
        "moveCameraRight",   
        "moveCameraDown"

    ] as const;
        
    public static styles = {

        parent: {

            // fill parent
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
        },

        zoomIn: {

            cursor: "zoom-in"
        },

        zoomOut: {

            cursor: "zoom-out"
        },

        grab: {

            cursor: "grab"
        },

        grabbing: {

            cursor: "grabbing"
        }

    } as const;

    /// Public static methods
    
    public static stateToProps = ({ sim, theme, keyboard }: StateShape) => ({ sim, theme, keyboard });

    /// Protected members

    // references will be initialized in setup
    protected p5: P5 = null as any;

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

    }

    protected setupKeyBindings(): void {

        this.bindings.moveCameraLeft = () => this.moveCamera(-this.getCameraMoveDelta(), 0);
        this.bindings.moveCameraUp = () => this.moveCamera(0, -this.getCameraMoveDelta());
        this.bindings.moveCameraRight = () => this.moveCamera(this.getCameraMoveDelta(), 0);;
        this.bindings.moveCameraDown = () => this.moveCamera(0, this.getCameraMoveDelta());
    }

    protected /* p5 */ setup = (p5: P5): void => {

        // setup references
        this.p5 = p5;

        this.windowResizedHandler();

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

        const newScale = lodash.clamp(this.camera.scale + (scale.delta * zoomModifier), scale.min, scale.max);
        const scaleDelta = newScale - this.camera.scale;

        this.adjustCamera(targetX, targetY, scaleDelta);

        this.camera.scale = newScale;
    }

    // query methods

    protected getCameraMoveDelta(): number {

        return (this.props.sim.camera.moveDelta / 1000) * this.timeDelta * this.camera.scale;
    }

    protected getZoomModifierClass() {

        switch(this.state.zoomModifier) {

            case 0: return this.props.classes.grab;
            case 1: return this.props.classes.zoomIn;
            case -1: return this.props.classes.zoomOut;
        }

        return "";
    }
    
    protected getClasses() {

        return [this.props.classes.parent, this.getZoomModifierClass(), 
            { [this.props.classes.grabbing]: this.state.mouseDragging }]
    }

    // mutator methods

    protected moveToAreaCenter() {

        // --- shorthands
        const camera = this.camera;
        const p5 = this.p5;
        const area = this.props.sim.area;
        // --- shorthands

        camera.x = (- p5.windowWidth / 2) + area.width / 2;
        camera.y = (- p5.windowHeight / 2) + area.height / 2 ;
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
    
        this.clampCameraToArea()
    }

    protected clampCameraToArea() {

        // --- shorthands
        const area = this.props.sim.area;
        const p5 = this.p5;
        const margin = 150;
        // --- shorthands

        this.camera.x = lodash.clamp(this.camera.x, - p5.windowWidth + margin, area.width - margin);
        this.camera.y = lodash.clamp(this.camera.y, - p5.windowHeight + margin, area.height - margin);
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
        const styler = simStylers[this.props.theme];
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
        const styler = simStylers[this.props.theme];
        // --- shorthands

        styler.area(p5);
        
        p5.rect(0, 0, area.width, area.height)
    }

    protected drawGrid(): void {

        // --- shorthands 
        const grid = this.props.sim.grid;
        const area = this.props.sim.area;
        // --- shorthands

        if(!grid.draw) return;

        this.drawGridLines({ intensity: grid.intensity, boundary: area.width,
                             highlight: grid.highlight,
                             getCoordinates: (x: number) => ({ x1: x, y1: 0, x2: x, y2: area.height })
        });

        this.drawGridLines({ intensity: grid.intensity, boundary: area.height,
                             highlight: grid.highlight,
                             getCoordinates: (y: number) => ({ x1: 0, y1: y, x2: area.width, y2: y })
        });

    }

    protected drawGridLines(options: GridLineOptions): void {

        // --- shorthands 
        const p5 = this.p5;
        const styler = simStylers[this.props.theme]; 
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
        const styler = simStylers[this.props.theme];
        // --- shorthands

        styler.boundingBox(p5);
        
        p5.rect(0, 0, area.width, area.height)
    }

    protected drawFPS(): void {

        // --- shorthands
        const p5 = this.p5;
        const styler = simStylers[this.props.theme];
        // --- shorthands

        p5.textAlign(p5.RIGHT);
        styler.fps(p5);
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



        return <P5Sketch
                        classNames={this.getClasses()}
                        tabIndex={0}
                        setup={this.setup}
                        loop={this.loop} 
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

export default connect(Simulation.stateToProps)(withStyles(Simulation.styles)(Simulation));