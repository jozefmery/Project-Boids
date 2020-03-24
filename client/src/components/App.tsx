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
import { Provider as ReduxStateProvider } from "react-redux";

// import redux store
import { reduxStateStore } from "./state/stateStore";

// import custom components
import Simulation from "./Simulation";
import UI from "./ui/Main";

class App extends Component {

	/// Public methods

	public render() {

		return (
			<ReduxStateProvider store={reduxStateStore}>
				<Simulation parentID="sim-canvas-parent"/> 
				<UI /> 
			</ReduxStateProvider>
		);
	}
}

export default App;
