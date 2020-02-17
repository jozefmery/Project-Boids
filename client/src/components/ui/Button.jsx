/**
 * File: Button.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description:
 * 
 */

// import dependencies
import React, { Component } from 'react';
import PropTypes from "prop-types";

class Button extends Component {
    
    /// Properties

    static propTypes = {

        className: PropTypes.string,
        id: PropTypes.string,
        onClick: PropTypes.func,
        content: PropTypes.func,
        tooltip: PropTypes.string
    };

    static defaultProps = {

        content: () => {}
    };

    /// Methods

    render() { 

        return (
            <div className={this.props.className} id={this.props.id} onClick={this.props.onClick} title={this.props.tooltip}>
            {this.props.content()}
            </div>
            );
    }
}
 
export default Button;