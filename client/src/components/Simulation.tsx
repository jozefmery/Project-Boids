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
import Sketch from "react-p5";
import classNames from "classnames";
import P5 from "p5";

// import react-redux
import { connect } from "react-redux";
 
// import stylers
import stylers from "../stylers";

// import hotkeys
import { HotkeyEvent, HotKeyContext } from "../hotkeys";

// import type information
import { StateShape } from "./state/defaultState";

type SimulationProps = Pick<StateShape, "sim" | "theme"> & {

    parentClasses?: string | string[];
    parentID: string;
};

class Simulation extends Component<SimulationProps> {

    /// Public static members

    public static defaultProps = {

        parentClasses: "",
        parentID: ""
    }

    /// Public static methods

    public static stateToProps = ({ sim, theme }: StateShape) => ({ sim, theme });

    /// Private members

    // references will be initialized in setup
    private p5: P5 = null as any;
    private parent: Element = null as any;

    private timeStamp: number = 0;
    private td: number = 0;

    private hotKeys: HotKeyContext = new HotKeyContext();

    /// Private methods

    private updateCanvasParent() {

        // set parent classes and id
        this.parent.className = classNames(this.props.parentClasses);
        this.parent.id = this.props.parentID
    }

    private setupEvents() {

        // this.eventHandlers = {

        //     keyChanged: new EventHandler("keyChanged", event => this.props.setKeyPressed(event)),
        //     mouseButtonChanged: new EventHandler("mouseButtonChanged", event => this.props.setMouseButtonPressed(event)),
        //     windowBlurred: new EventHandler("windowBlurred", _ => this.props.resetKeys()),
        //     mouseWheel: new EventHandler("mouseWheel", ({ wheelUp, mouseX, mouseY }) => 
        //     this.props.changeCameraCurrentScale({ scaleDelta: (wheelUp ? 1 : -1) * this.props.sim.camera.scale.factor,
        //                                           mouseX, mouseY }))
        // };
    }

    private setupHotkeys() {

        // this.hotKeys = {

        //     moveUp: this.hotKeyContext.createHotkey(["w"], ({ event }) => this.props.setCameraMoveDirection({ direction: "up",
        //         move: event === HotkeyEvent.KEYDOWN }), 
        //         HotkeyEvent.BOTH),
            
        //     moveRight: this.hotKeyContext.createHotkey(["d"], ({ event }) => this.props.setCameraMoveDirection({ direction: "right",
        //         move: event === HotkeyEvent.KEYDOWN }), 
        //         HotkeyEvent.BOTH),

        //     moveDown: this.hotKeyContext.createHotkey(["s"], ({ event }) => this.props.setCameraMoveDirection({ direction: "down",
        //         move: event === HotkeyEvent.KEYDOWN }), 
        //         HotkeyEvent.BOTH),

        //     moveLeft: this.hotKeyContext.createHotkey(["a"], ({ event }) => this.props.setCameraMoveDirection({ direction: "left",
        //         move: event === HotkeyEvent.KEYDOWN }), 
        //         HotkeyEvent.BOTH)
        // }
    }

    private /* p5 */ setup = (p5: P5, parent: Element) => {

        // setup references
        this.p5 = p5;
        this.parent = parent;
        
        // setup timing variables
        this.timeStamp = new Date().getTime();
        this.td = 0;

        // create canvas with current parent size
        this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight).parent(this.parent);

        // set initial id and classes
        this.updateCanvasParent();

        this.setupEvents();

        this.setupHotkeys();
    }

    private update() {

        // // --- shorthands
        // const currentScale = this.props.sim.camera.scale.current;
        // const move = this.props.sim.camera.move;
        // const delta = (move.delta * this.td * currentScale) / 1000;
        // // --- shorthands 
        
        // const directionToObject = {
            
        //     up: () => ({ x: 0, y: -delta }),
        //     right: () => ({ x: delta, y: 0 }),
        //     down: () => ({ x: 0, y: delta }),
        //     left: () => ({ x: -delta, y: 0 }),
        // };
        
        // const directions = Object.keys(directionToObject);
        // for(const idx in directions) {
            
        //     const direction = directions[idx];
        //     if(move[direction]) {


        //         this.props.moveCamera(directionToObject[direction]());
        //     }
        // }
    }

    private /* p5 */ loop = () => {

        // update timing variable
        this.td = new Date().getTime() - this.timeStamp;
        this.timeStamp = new Date().getTime();

        this.update();
        this.draw();
    }

    private drawBoundingBox() {

        // --- shorthands
        const p5 = this.p5;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.boundingBox(p5);
        
        p5.rect(0, 0, area.x, area.y)
    }

    private drawGridLines(options: { intensity: number, 
                                    boundary: number,
                                    highlight: number,
                                    coord: (_: number) => { x1: number, x2: number, y1: number, y2: number } }) {

        // --- shorthands 
        const p5 = this.p5;
        // --- shorthands

        for(let i = 0; i * options.intensity < options.boundary; i++) {

            p5.strokeWeight(1);

            if(options.highlight && (i % options.highlight === 0)) {

                p5.strokeWeight(2);
            }

            let coord = options.coord(i * options.intensity);
            p5.line(coord.x1, coord.y1, coord.x2, coord.y2);
        }
    }

    private drawGrid() {

        // --- shorthands 
        const grid = this.props.sim.grid;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        if(!grid.draw) return;

        styler.grid(this.p5);

        this.drawGridLines({ intensity: grid.intensity, boundary: area.x,
                             highlight: grid.highlight,
                             coord: (x: number) => ({ x1: x, y1: 0, x2: x, y2: area.y })
        });

        this.drawGridLines({ intensity: grid.intensity, boundary: area.y,
                             highlight: grid.highlight,
                             coord: (y: number) => ({ x1: 0, y1: y, x2: area.x, y2: y })
        });

    }

    private applyTransform() {

        // // --- shorthands 
        // const p5 = this.p5;
        // const area = this.props.sim.area;
        // const cameraTarget = this.props.sim.camera.target;
        // const scale = this.props.sim.camera.scale;
        // // --- shorthands

        // p5.translate( - cameraTarget.x, - cameraTarget.y);
        // this.p5.scale(scale.current);
    }

    private drawBackground() {

        // --- shorthands 
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.background(this.p5);
    }

    private drawArea() {

        // --- shorthands 
        const p5 = this.p5;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.area(p5);
        
        p5.rect(0, 0, area.x, area.y)
    }

    private draw() {

        this.applyTransform();
        this.drawBackground();
        this.drawArea();
        this.drawGrid();
        this.drawBoundingBox();
        
        // this.p5.noFill();
        // this.p5.rect(this.props.sim.camera.target.x, this.props.sim.camera.target.y, this.p5.windowWidth, this.p5.windowHeight)
    }

    private windowResized = () => {

        // resize canvas when parent div is resized
        this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
    }

    /// Public methods

    public componentDidUpdate() {

        this.updateCanvasParent();
    }

    public /* react */ render() {

        return <Sketch setup={this.setup as any} // react-p5 uses incompatible p5 declaration
                        draw={this.loop} 
                        windowResized={this.windowResized} />;
    }
}

export default connect(Simulation.stateToProps)(Simulation);