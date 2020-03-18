/**
 * File: Main.jsx
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
import LanguageData from "../../lang/data";

class Main extends Component {

    /// Properties

    static stateToProps = ({ language }) => ({ language });

    /// Methods

    updateAppTitle() {

        // --- shorthands 
        const languageData = LanguageData[this.props.language];
        // --- shorthands

        document.title = languageData.title;
    }

    componentDidMount() {

        this.updateAppTitle();
    }

    componentDidUpdate() {

        this.updateAppTitle();
    }

    render() {

        return (
            <div id="ui">
                <TopBar />
                <Controls />
            </div>);
    }
}

// export component
export default connect(Main.stateToProps, {})(Main);
