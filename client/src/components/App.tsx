/**
 * File: App.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Main component implementation, which ties together the whole app implementation.
 * 
 */

// import dependencies
import React, { Component } from "react";

// import react-redux
import { connect } from "react-redux";

// import custom components
import Simulation from "./Simulation";
import Controls from "./ui/Controls";
import TopBar from "./ui/TopBar";

// import language data
import languageData from "../lang/all";

// import type information
import { StateShape } from "../state/defaultState";

type AppProps = Pick<StateShape, "language">;

class App extends Component<AppProps> {

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
			<React.Fragment>
				<Simulation parentID="sim-canvas-parent"/> 
				<TopBar />
                <Controls />
			</React.Fragment>
		);
	}
}

export default connect(App.stateToProps)(App);
