/**
 * File: Main.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Defines the root of the UI, brings all other components together.
 * 
 */

// import dependencies
import React, { Component } from "react";

// import react-redux
import { connect } from "react-redux";

// import custom components
import Controls from "./Controls";
import TopBar from "./TopBar";

// import language data
import languageData from "../../lang/all";

// import type information
import { StateShape } from "../state/defaultState";

type MainProps = Pick<StateShape, "language">;

class Main extends Component<MainProps> {

    /// Public static methods

    public static stateToProps = ({ language }: StateShape) => ({ language });

    /// Private methods
    
    private updateAppTitle() {
        
        // --- shorthands 
        const currentLang = languageData[this.props.language];
        // --- shorthands
        
        document.title = currentLang.title;
    }
    
    /// Public methods

    public componentDidMount() {

        this.updateAppTitle();
    }

    public componentDidUpdate() {

        this.updateAppTitle();
    }

    public render() {

        return (
            <div id="ui">
                <TopBar />
                <Controls />
            </div>);
    }
}

// export component
export default connect(Main.stateToProps)(Main);
