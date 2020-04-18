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
import React, { useEffect } from "react";

// import react-redux
import { useSelector } from "react-redux";

// import font
import "typeface-roboto";

// import custom components
import Simulation from "./Simulation";
import Controls from "./ui/Controls";
import TopBar from "./ui/TopBar";

// import stylers
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// import language data
import languageData from "../lang/all";

// import type information
import { StateShape } from "../state/defaultState";

function useSetTitle() {

    const currentLanguage = useSelector((state: StateShape) => state.global.language);

    useEffect(() => {

        document.title = languageData[currentLanguage].title;
        
    }, [currentLanguage]);
}

function useMUItheme() {

    const theme = useSelector((state: StateShape) => state.global.theme);
    return createMuiTheme({ theme });
}

export default function App() {

    useSetTitle();

    return (
        <ThemeProvider theme={useMUItheme()}>
            <Simulation /> 
            <TopBar />
            <Controls />
        </ThemeProvider>
    );
}
