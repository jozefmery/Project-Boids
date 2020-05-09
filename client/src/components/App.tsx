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
import Stats from "./ui/Stats";

// import hotkey context provider
import { KeyCaptureContext } from "./Hotkeys";

// import stylers
import { createMuiTheme, ThemeProvider, makeStyles } from "@material-ui/core/styles";

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

const useUILayoutStyle = makeStyles({

    layout: {

        position: "absolute",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",

        pointerEvents: "none",

        "& *": {

            pointerEvents: "auto"
        },

        display: "grid",
        gridTemplate: "min-content auto min-content / auto"
    }

});

export default function App() {

    useSetTitle();

    const hotkeys = useSelector((state: StateShape) => state.hotkeys);

    const classes = useUILayoutStyle();

    return (
        <ThemeProvider theme={useMUItheme()}>
            <KeyCaptureContext hotkeys={hotkeys}>
                <Simulation />
                <div className={classes.layout}>
                    <TopBar />
                    <Stats />
                    <Controls />
                </div>
            </KeyCaptureContext>
        </ThemeProvider>
    );
}
