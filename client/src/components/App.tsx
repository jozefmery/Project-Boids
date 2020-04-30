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

// import hooks
import { useLanguageString } from "../hooks/UseLanguageString";

// import custom components
import Simulation from "./Simulation";
import Controls from "./ui/Controls";
import TopBar from "./ui/TopBar";

// import hotkey context provider
import { KeyCaptureContext } from "./Hotkeys";

// import stylers
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// import type information
import { StateShape } from "../state/types";

function useSetTitle() {

    const title = useLanguageString("title");

    useEffect(() => {

        document.title = title;
        
    }, [title]);
}

function useMUItheme() {

    const theme = useSelector((state: StateShape) => state.global.theme);
    return createMuiTheme({ theme });
}

export default function App() {

    useSetTitle();

    return (
        <ThemeProvider theme={useMUItheme()}>
            <KeyCaptureContext>
                <Simulation /> 
                <TopBar />
                <Controls />
            </KeyCaptureContext>
        </ThemeProvider>
    );
}
