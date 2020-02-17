/**
 * File: App.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Main component implementation, which ties together the whole app implementation.
 * 
 */

// import dependencies
import React, { Component } from "react";
import { Provider as ReduxStateProvider } from "react-redux";

// import redux store
import { reduxStateStore } from "./state/state";

// import custom components
import Simulation from "./Simulation";
import UI from "./ui/Main";

class App extends Component {

	render() {

		return (
			<ReduxStateProvider store={reduxStateStore}>
				<Simulation parentID="p5-canvas-parent"/> 
				<UI /> 
			</ReduxStateProvider>
		);
	}
}

export default App;
