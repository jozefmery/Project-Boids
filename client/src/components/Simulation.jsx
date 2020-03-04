/**
 * File: Simulation.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Simulation implementation, including drawing using p5 library.
 * 
 */

// import dependencies
import React, { Component } from "react";
import Sketch from "react-p5"
import PropTypes from "prop-types"
import classNames from "classnames";

// import react-redux
import { connect } from "react-redux";

// import redux actions
import simSlice from "./state/simSlice";
import languageSlice from "./state/languageSlice";
import controlsSlice from "./state/controlsSlice";

// import utilities
import { DispatchToProps } from "../utils";
 
// import stylers
import stylers from "../stylers";

// import event system
import { invokeEvent } from "../events";

class Simulation extends Component {

    /// Properties

    static propTypes = {

        parentClasses: PropTypes.oneOfType([

            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),

        parentID: PropTypes.string
    }

    static defaultProps = {

        parentClasses: "",
        parentID: ""
    }

    static stateToProps = ({ sim, controls, theme }) => ({ sim, controls, theme });

    //// Methods

    componentDidUpdate() {

        this.updateCanvasParent();
    }

    updateCanvasParent() {

        // set parent classes and id
        this.parent.className = classNames(this.props.parentClasses);
        this.parent.id = this.props.parentID
    }

    /* p5 */ setup = (p5Ref, parentRef) => {

        // setup references
        this.p5 = p5Ref;
        this.parent = parentRef;
        
        // setup timing variables
        this.timeStamp = new Date().getTime();
        this.td = 0;

        // set initial id and classes
        this.updateCanvasParent();

        // create canvas with current parent size
        this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight).parent(this.parent);
    }

    /* p5 */ loop = () => {

        // update timing variable
        this.td = new Date().getTime() - this.timeStamp;
        this.timeStamp = new Date().getTime();

        this.draw();
    }

    drawBoundingBox() {

        // --- shorthands
        const p5 = this.p5;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.boundingBox(p5);
        
        p5.rect(0, 0, area.x, area.y)
    }

    drawGridLines(options) {

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

    drawGrid() {

        // --- shorthands 
        const grid = this.props.sim.grid;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        if(!grid.draw) return;

        styler.grid(this.p5);

        this.drawGridLines({ intensity: grid.intensity, boundary: area.x,
                             highlight: grid.highlight,
                             coord: x => ({ x1: x, y1: 0, x2: x, y2: area.y })
        });

        this.drawGridLines({ intensity: grid.intensity, boundary: area.y,
                             highlight: grid.highlight,
                             coord: y => ({ x1: 0, y1: y, x2: area.x, y2: y })
        });

    }

    applyTransform() {

        // --- shorthands 
        const p5 = this.p5;
        const area = this.props.sim.area;
        const cameraTarget = this.props.sim.camera.target;
        // --- shorthands

        p5.translate(p5.windowWidth / 2 - area.x / 2 - cameraTarget.x, 
                     p5.windowHeight / 2 - area.y / 2 - cameraTarget.y);
        // this.p5.scale(this.props.sim.camera.scale.current);
    }

    drawBackground() {

        // --- shorthands 
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.background(this.p5);
    }

    drawArea() {

        // --- shorthands 
        const p5 = this.p5;
        const area = this.props.sim.area;
        const styler = stylers[this.props.theme];
        // --- shorthands

        styler.area(p5);
        
        p5.rect(0, 0, area.x, area.y)
    }

    draw() {

        this.applyTransform();
        this.drawBackground();
        this.drawArea();
        this.drawGrid();
        this.drawBoundingBox();
    }

    windowResized = () => {

        const eventData = { width: this.p5.windowWidth, height: this.p5.windowHeight }; 

        // resize canvas when parent div is resized
        this.p5.resizeCanvas(eventData.width, eventData.height);
        invokeEvent("windowResized", eventData);
    }

    keyPressed = () => {

        const eventData = { key: this.p5.key, pressed: true };

        this.props.setKeyPressed(eventData);
        invokeEvent("keyChanged", eventData);
    }

    keyReleased = () => {

        const eventData = { key: this.p5.key, pressed: false };

        this.props.setKeyPressed(eventData);
        invokeEvent("keyChanged", eventData);
    }

    mouseWheel = event => {
        
        // ignore non-standardized value
        const delta = Math.sign(event._mouseWheelDeltaY);
        // figure out movement direction
        const wheelUp = delta === -1;

        invokeEvent("mouseWheel", { wheelUp });
    }

    mouseMoved = event => {
 
        const eventData = { x: event.mouseX, y: event.mouseY };

        this.props.setMousePosition(eventData);
        invokeEvent("mouseMoved", eventData)
    }

    mousePressed = event => {

        const eventData = { button: event.mouseButton, pressed: true };

        this.props.setMouseButtonPressed(eventData);
        invokeEvent("mouseButtonChanged", eventData);
    }

    mouseReleased = event => {

        const eventData = { button: event.mouseButton, pressed: false };

        this.props.setMouseButtonPressed(eventData);
        invokeEvent("mouseButtonChanged", eventData);
    }

    /* react */ render() {

        return <Sketch setup={this.setup} draw={_ => this.loop()} 
                        windowResized={this.windowResized} 
                        keyPressed={this.keyPressed} 
                        keyReleased={this.keyReleased}
                        mouseWheel={this.mouseWheel}
                        mouseMoved={this.mouseMoved}
                        mousePressed={this.mousePressed}
                        mouseReleased={this.mouseReleased}
                        />;
    }
}

export default connect(Simulation.stateToProps, DispatchToProps([simSlice, controlsSlice, languageSlice]))(Simulation);