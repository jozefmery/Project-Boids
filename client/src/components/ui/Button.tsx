/**
 * File: Button.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines a simple reusable, customizable button component.
 * 
 */

// import dependencies
import React, { Component } from 'react';
import classNames from "classnames";

type ButtonProps = {

    classNames?: string | string[];
    id?: string;
    onClick: () => void;
    content: () => JSX.Element | string;
    tooltip: string;
};

class Button extends Component<ButtonProps> {
    
    /// Public static members

    public static defaultProps = {

        classNames: "",
        id: "",
        onClick: null,
        content: () => null,
        tooltip: ""
    };

    /// Public methods

    public render() { 

        return (
            <div className={classNames("button", this.props.classNames)} id={this.props.id} onClick={this.props.onClick} title={this.props.tooltip}>
            {this.props.content()}
            </div>
            );
    }
}
 
export default Button;