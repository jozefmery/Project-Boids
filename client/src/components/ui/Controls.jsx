/**
 * File: Controls.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description:
 * 
 */

// import dependencies
import React, { Component } from "react";
import { Capitalize, DispatchToProps } from "../../utils";

// import react-redux
import { connect } from "react-redux";

// import redux slices
import langSlice from "../state/langSlice";
import simSlice from "../state/simSlice";

// import custom components
import Button from "./Button";

class Controls extends Component {

    /// Properties

    static stateToProps = state => ({

        lang: state.lang.data,
        sim: state.sim
    });
   
    /// Methods

    toggleSimState = () => this.props.setSimPlayState(!this.props.sim.state.play);
    
    render() { 

        let text = Capitalize((this.props.sim.state.play) ? this.props.lang["play"] : this.props.lang["pause"]);

        return (
            <div id="bottom-controls">
                    <Button content={() => text} id="" className="button" 
                            tooltip={text}
                            onClick={this.toggleSimState}
                    />
            </div>);
    }
}
 
export default connect(Controls.stateToProps, DispatchToProps([simSlice, langSlice]))(Controls);