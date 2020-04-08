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

// import font
import "typeface-roboto";

// import custom components
import Simulation from "./Simulation";
import Controls from "./ui/Controls";
import TopBar from "./ui/TopBar";

// import stylers
import { createMuiTheme, ThemeProvider, Theme as MUITheme } from "@material-ui/core/styles";

// import language data
import languageData from "../lang/all";

// import type information
import { StateShape } from "../state/defaultState";
import { ThemeData } from "../stylers";

type AppProps = Pick<StateShape, "language" | "theme">;

class App extends Component<AppProps> {

	/// Public static methods

    public static stateToProps = ({ language, theme }: StateShape) => ({ language, theme });

    /// Protected methods
    
    protected updateAppTitle() {
        
        // --- shorthands 
        const currentLang = languageData[this.props.language];
        // --- shorthands
        
        document.title = currentLang.title;
    }

    protected getTheme(): MUITheme {

        return createMuiTheme({ theme: this.props.theme } as ThemeData);
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
			<ThemeProvider theme={this.getTheme()}>
				<Simulation parentID="sim-canvas-parent"/> 
				<TopBar />
                <Controls />
			</ThemeProvider>
		);
	}
}

export default connect(App.stateToProps)(App);
