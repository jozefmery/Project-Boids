/**
 * File: ToggleButton.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a simple reusable, customizable toggle button component.
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
        tooltip: PropTypes.string,
        isToggled: PropTypes.bool
    };

    static defaultProps = {

        classNames: "",
        id: "",
        onClick: null,
        tooltip: "",
        isToggled: false
    };

    /// Methods

    render() { 

        return (
            <div className={classNames("toggle-button", this.props.classNames, {"toggled": this.props.isToggled})} 
                 id={this.props.id} 
                 onClick={this.props.onClick} 
                 title={this.props.tooltip}>
                
                <div /* wrapper which enables transforming circle based on parent dimensions */>
                    <div /* moving circle */ />
                </div>
            
            </div>
            );
    }
}
 
export default Button;