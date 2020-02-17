/**
 * File: Main.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description:
 * 
 */

// import dependencies
import React, { Component } from 'react';
import { Capitalize } from "../../utils";

// import redux
import { connect } from "react-redux";

// import custom components
import Button from "./Button";

// import redux slices
import langSlice from "../state/langSlice";
import simSlice from "../state/simSlice";

class Main extends Component {

    /// Properties

    static stateToProps = state => ({

        lang: state.lang.data,
        sim: state.sim
    });
   
    /// Methods

    toggleSimState = () => this.props.setSimPlayState(!this.props.sim.state.play);

    render() {

        return (
        <div id="ui">

            <div id="bottom-controls">
                <Button content={() => "PLAY"} id="" className="button square" 
                        tooltip={Capitalize((this.props.sim.state.play) ? this.props.lang["play"] : this.props.lang["pause"])}
                        onClick={this.toggleSimState}
                        />
            </div>

        </div>);
    }
}

// export component connected to redux
export default connect(Main.stateToProps, { setLanguage: langSlice.actions.setLanguage, 
                                            setSimPlayState: simSlice.actions.setSimPlayState })(Main);