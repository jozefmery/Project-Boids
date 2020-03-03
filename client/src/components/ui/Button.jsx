/**
 * File: Button.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines a simple reusable, customizable button component.
 * 
 */

// import dependencies
import React, { Component } from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

class Button extends Component {
    
    /// Properties

    static propTypes = {

        classNames: PropTypes.oneOfType([

            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        
        id: PropTypes.string,
        onClick: PropTypes.func,
        content: PropTypes.func,
        tooltip: PropTypes.string
    };

    static defaultProps = {

        classNames: "",
        id: "",
        onClick: null,
        content: null,
        tooltip: ""
    };

    /// Methods

    render() { 

        return (
            <div className={classNames("button", this.props.classNames)} id={this.props.id} onClick={this.props.onClick} title={this.props.tooltip}>
            {this.props.content ? this.props.content() : null}
            </div>
            );
    }
}
 
export default Button;