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
import React, { Component } from "react";

// import custom components
import Controls from "./Controls";
import TopBar from "./TopBar";

class Main extends Component {

    /// Methods

    render() {

        return (
            <div id="ui">
                <TopBar />
                <Controls />
            </div>);
    }
}

// export component
export default Main;
