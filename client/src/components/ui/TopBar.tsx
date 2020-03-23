/**
 * File: TopBar.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains various helper components.
 * 
 */

// import dependencies
import React, { Component } from "react";
import classNames from "classnames";

// import react-redux
import { connect } from "react-redux";

// import redux slices
import themeSlice from "../state/themeSlice";

// import custom components
import ToggleButton from "./ToggleButton";

// import type information
import { StateShape } from "../state/defaultState";

type TopBarProps = Pick<StateShape, "theme"> & typeof themeSlice.actions;

class TopBar extends Component<TopBarProps> {
    
    /// Properties

    static stateToProps = ({ theme }: StateShape) => ({ theme });
   
    /// Methods

    isThemeToggled() {

        return this.props.theme === "dark";
    } 

    render() { 

        return (
            <div id="top-bar" className={classNames(this.props.theme, "ui-panel")}>
                <ToggleButton classNames={this.props.theme} onClick={() => this.props.toggleTheme()} isToggled={this.isThemeToggled()} />
            </div>
                );
    }
}

export default connect(TopBar.stateToProps, { ...themeSlice.actions })(TopBar);
