/**
 * File: ToggleButton.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a simple reusable, customizable toggle button component.
 * 
 */

// import dependencies
import React, { Component } from 'react';
import classNames from "classnames";

type ToggleButtonProps = {

    classNames?: Parameters<typeof classNames>[0];
    id?: string;
    onClick: () => void;
    tooltip: string;
    isToggled: boolean;
}
;
class Button extends Component<ToggleButtonProps> {
    
    /// Public static members

    public static readonly defaultProps = {

        classNames: "",
        id: "",
        onClick: null,
        tooltip: "",
        isToggled: false
    };

    /// Public methods

    public render() { 

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