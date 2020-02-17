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

// import redux
import { connect } from "react-redux";

// import sim actions
import simSlice from "./state/simSlice";
import languageSlice from "./state/langSlice";
import controlsSlice from "./state/controlsSlice";
 
class Simulation extends Component {

    /// Properties

    static propTypes = {

        parentClasses: PropTypes.oneOfType([

            PropTypes.string,
            PropTypes.array
        ]),

        parentID: PropTypes.string,
        sim: PropTypes.object,
        controls: PropTypes.object
    }

    static defaultProps = {

        parentClasses: [],
        parentID: ""
    }

    static stateToProps = state => ({

        sim: state.sim,
        controls: state.controls
    });

    //// Methods

    componentDidUpdate() {

        this.updateParent();
    }

    updateParent() {

        // set parent classes and id
        this.parent.className = classNames(this.props.parentClasses);
        this.parent.id = this.props.parentID
    }

    setup = (p5Ref, parentRef) => {

        // setup references
        this.p5 = p5Ref;
        this.parent = parentRef;
        
        this.timeStamp = new Date().getTime();
        this.td = 0;

        this.updateParent();

        // create canvas with current parent size
        this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight).parent(this.parent);
    }

    update() {

        const ms = 300; /* /s */;

        const move = (ms / 1000) * this.td;

        if(this.props.controls.keyMap.w) {  

            this.props.moveCamera({ x: 0 , y: -move });

        } 
        if(this.props.controls.keyMap.s) {

            this.props.moveCamera({ x: 0 , y: move });
        }

        if(this.props.controls.keyMap.a) {

            this.props.moveCamera({ x: -move, y: 0 });

        } 
        if(this.props.controls.keyMap.d) {

            this.props.moveCamera({ x: move, y: 0 });
        }
    }

    loop = () => {

        this.td = new Date().getTime() - this.timeStamp;

        this.timeStamp = new Date().getTime();

        this.update();

        this.draw();
    }

    drawBoundingBox() {

        this.p5.noFill();
        this.p5.stroke(0);
        this.p5.strokeWeight(3);
        
        this.p5.rect(0, 0, this.props.sim.state.area.x, this.props.sim.state.area.y)
    }

    drawGridLines(options) {

        this.p5.stroke(200);

        for(let i = 0; i * options.intensity < options.boundary; i++) {

            this.p5.strokeWeight(1);

            if(options.highLight && (i % options.highLight === 0)) {

                this.p5.strokeWeight(2);
            }

            let coord = options.coord(i * options.intensity);
            this.p5.line(coord.x1, coord.y1, coord.x2, coord.y2);
        }
    }

    drawGrid() {

        if(!this.props.sim.grid.draw) return;

        this.drawGridLines({ intensity: this.props.sim.grid.intensity, boundary: this.props.sim.state.area.x,
                             highLight: this.props.sim.grid.highLight,
                             coord: x => ({x1: x, y1: 0, x2: x, y2: this.props.sim.state.area.y })
        });

        this.drawGridLines({ intensity: this.props.sim.grid.intensity, boundary: this.props.sim.state.area.y,
            highLight: this.props.sim.grid.highLight,
            coord: y => ({x1: 0, y1: y, x2: this.props.sim.state.area.x, y2: y })
        });
        }

    applyTransform() {

        this.p5.translate(this.p5.windowWidth / 2 - this.props.sim.state.area.x / 2 - this.props.sim.camera.target.x, 
                        this.p5.windowHeight / 2 - this.props.sim.state.area.y / 2 - this.props.sim.camera.target.y);
        // this.p5.scale(this.props.sim.camera.scale.current);
    }

    draw() {

        this.applyTransform();
        this.p5.background(255);
        this.drawGrid();
        this.drawBoundingBox();
    }

    windowResized = () => {

        // resize canvas when parent div is resized
        this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
    }

    keyPressed = () => {

        this.props.setKeyPressed({ key: this.p5.key, pressed: true });
    }

    keyReleased = () => {

        this.props.setKeyPressed({ key: this.p5.key, pressed: false });
    }

    mouseWheel = event => {
        
        // console.log(event)
        // this.props.changeCameraScaleBy( - event._mouseWheelDeltaY / 10000);
    }

    /* react */ render() {

        return <Sketch setup={this.setup} draw= {_ => this.loop() } 
                        windowResized={this.windowResized} 
                        keyPressed={this.keyPressed} 
                        keyReleased={this.keyReleased}
                        mouseWheel={this.mouseWheel}
                        />;
    }
}

export default connect(Simulation.stateToProps, {   setLanguage: languageSlice.actions.setLanguage,
                                                    moveCamera: simSlice.actions.moveCamera,
                                                    setKeyPressed: controlsSlice.actions.setKeyPressed })(Simulation);