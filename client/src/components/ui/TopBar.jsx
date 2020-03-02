/**
 * File: TopBar.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description:
 * 
 */

// import dependencies
import React, { Component } from "react";
import { DispatchToProps } from "../../utils";
import classNames from "classnames";

// import react-redux
import { connect } from "react-redux";

// import redux slices
import themeSlice from "../state/themeSlice";

// import custom components
import ToggleButton from "./ToggleButton";

class TopBar extends Component {
    
    /// Properties

    static stateToProps = ({ theme }) => ({ theme });
   
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
 
export default connect(TopBar.stateToProps, DispatchToProps([themeSlice]))(TopBar);