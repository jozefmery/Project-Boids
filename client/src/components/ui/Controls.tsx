/**
 * File: Controls.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains components controlling the simulation.
 * 
 */

// import dependencies
import React, { Component } from "react";
import { capitalize } from "../../utils";
import classNames from "classnames";

// import react-redux
import { connect } from "react-redux";

// import redux slices
import simSlice from "../state/simSlice";

// import custom components
import Button from "./Button";

// import type information
import { StateShape } from "../state/defaultState";

// import language data
import LanguageData from "../../lang/all";

type ControlsProps = Pick<StateShape, "language" | "sim" | "theme"> & typeof simSlice.actions;

class Controls extends Component<ControlsProps> {

    /// Public static methods

    public static stateToProps = ({ language, sim, theme }: StateShape) => ({ language, sim, theme });
   
    /// Public methods
    
    public render() {

        // --- shorthands 
        const simRunning = this.props.sim.running;
        const languageData = LanguageData[this.props.language];
        const theme = this.props.theme;
        // --- shorthands

        let text = capitalize((simRunning) ? languageData["pause"] : languageData["play"]);

        return (
            <div id="bottom-controls" className={classNames(theme, "ui-panel")}>
                    <Button content={() => text} id="" classNames={theme} 
                            tooltip={text}
                            onClick={() => this.props.toggleSimRunning()}
                    />
            </div>);
    }
}
 
export default connect(Controls.stateToProps, { ...simSlice.actions })(Controls);