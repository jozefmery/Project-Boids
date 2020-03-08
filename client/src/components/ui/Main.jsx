/**
 * File: Main.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines the root of the UI, brings all other components together.
 * 
 */

// import dependencies
import React, { Component } from "react";

// import react-redux
import { connect } from "react-redux";

// import custom components
import Controls from "./Controls";
import TopBar from "./TopBar";

// import language data
import LanguageData from "../../lang/data";

// import event system
import { invokeEvent } from "../../events";

// import redux slices
import controlsSlice from "../state/controlsSlice";

// import utilities
import { DispatchToProps } from "../../utils";

// define helper which translates mouse button number to strings
function buttonToString(button) {

    switch(button) {

        case 0: return "left";
        case 1: return "middle";
        case 2: return "right";
        // unsupported button, return original value
        default: return button;
    }
}

class Main extends Component {

    /// Properties

    static stateToProps = ({ language }) => ({ language });

    /// Methods

    updateAppTitle() {

        // --- shorthands 
        const languageData = LanguageData[this.props.language];
        // --- shorthands

        document.title = languageData.title;
    }

    onkeydown = event => {

        // ignore repeated event calls
        if(event.repeat) return;

        const eventData = { key: event.key, pressed: true };

        this.props.setKeyPressed(eventData);
        invokeEvent("keyChanged", eventData);
    }

    onkeyup = event => {

        const eventData = { key: event.key, pressed: false };

        this.props.setKeyPressed(eventData);
        invokeEvent("keyChanged", eventData);
    }

    onwheel = event => {
        
        // ignore non-standardized value
        const delta = Math.sign(event.deltaY);
        // figure out movement direction
        const wheelUp = delta === -1;

        invokeEvent("mouseWheel", { wheelUp });
    }

    onmousemove = event => {

        const eventData = { x: event.clientX, y: event.clientY,
                            dx: event.movementX, dy: event.movementY };

        this.props.setMousePosition(eventData);
        invokeEvent("mouseMoved", eventData);
    }

    onmousedown = event => {

        const eventData = { button: buttonToString(event.button), pressed: true };

        this.props.setMouseButtonPressed(eventData);
        invokeEvent("mouseButtonChanged", eventData);
    }

    onmouseup = event => {

        const eventData = { button: buttonToString(event.button), pressed: false };

        this.props.setMouseButtonPressed(eventData);
        invokeEvent("mouseButtonChanged", eventData);
    }

    setupEvents() {

        ["onkeydown",
         "onkeyup",
         "onwheel",
         "onmousemove",
         "onmousedown",
         "onmouseup"
        ].forEach(event => window[event] = this[event]);
    }

    componentDidMount() {

        this.updateAppTitle();
        this.setupEvents();
    }

    componentDidUpdate() {

        this.updateAppTitle();
    }

    render() {

        return (
            <div id="ui">
                <TopBar />
                <Controls />
            </div>);
    }
}

// export component
export default connect(Main.stateToProps, DispatchToProps([controlsSlice]))(Main);
