/**
 * File: Controls.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains components controlling the simulation.
 * 
 */

// import dependencies
import React, { Component } from "react";
import { Capitalize, DispatchToProps } from "../../utils";
import classNames from "classnames";

// import react-redux
import { connect } from "react-redux";

// import redux slices
import languageSlice from "../state/languageSlice";
import simSlice from "../state/simSlice";

// import custom components
import Button from "./Button";

// import language data
import LanguageData from "../../lang/data";

class Controls extends Component {

    /// Properties

    static stateToProps = ({ language, sim, theme }) => ({ language, sim, theme });
   
    /// Methods
    
    render() {

        // --- shorthands 
        const simRunning = this.props.sim.running;
        const languageData = LanguageData[this.props.language];
        const theme = this.props.theme;
        // --- shorthands

        let text = Capitalize((simRunning) ? languageData["pause"] : languageData["play"]);

        return (
            <div id="bottom-controls" className={classNames(theme, "ui-panel")}>
                    <Button content={() => text} id="" classNames={theme} 
                            tooltip={text}
                            onClick={() => this.props.toggleSimRunning()}
                    />
            </div>);
    }
}
 
export default connect(Controls.stateToProps, DispatchToProps([simSlice, languageSlice]))(Controls);