
// import dependencies
import React, { Component } from "react";
import Sketch from "react-p5"
import PropTypes from "prop-types"
import classNames from "classnames";

// import redux
import { connect } from "react-redux";

// import sim actions
import { setPreys } from "../redux/actions/simActions";
 
class Simulation extends Component {

    /// Properties

    static propTypes = {

        parentClasses: PropTypes.oneOfType([

            PropTypes.string,
            PropTypes.array
        ]),

        parentID: PropTypes.string,
    }

    static defaultProps = {

        parentClasses: [],
        parentID: ""
    }

    static stateToProps = state => ({

        preys: state.simReducer.preys
    });

    //// Members

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
        
        this.updateParent();

        // create canvas with current parent size
        this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight).parent(this.parent)
    }

    loop = () => {

        this.draw();
    }

    draw() {

    }

    windowResized = () => {

        // resize canvas when parent div is resized
        this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
    }

    /* react */ render() {

        return <Sketch setup={this.setup} draw= {_ => this.loop() } windowResized={this.windowResized} />;
    }
}

export default connect(Simulation.stateToProps, {})(Simulation);