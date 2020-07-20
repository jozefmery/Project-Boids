/**
 * File: AppState.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Brings together all state providers.
 * 
 */


// import react
import React from "react";

// import react-redux
import { useSelector, Provider as ReduxStateProvider } from "react-redux";

// import stylers
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// import state providers
import { useSimState } from "./state/simulation";
import { KeyCaptureContext } from "./Hotkeys";
import { useStatsState } from "./state/stats";
import reduxStateStore from "./state/store";

// import type information
import { StateShape } from "./types/redux";
import { SimState } from "./types/simulation";
import { StatsState } from "./types/stats";

export const SimStateContext = React.createContext<SimState>(null as any);

function SimStateProvider({ children }: { children: React.ReactNode }) {

    const simState = useSimState();

    return (
    
    <SimStateContext.Provider value={simState}>
        {children}
    </SimStateContext.Provider>);
}

export const StatsStateContext = React.createContext<StatsState>(null as any);

function StatsStateProvider({ children }: { children: React.ReactNode }) {

    const statsState = useStatsState();

    return (
    
    <StatsStateContext.Provider value={statsState}>
        {children}
    </StatsStateContext.Provider>);
}

function KeyCaptureContextProvider({ children }: { children: React.ReactNode }) {

    const hotkeys = useSelector((state: StateShape) => state.hotkeys);

    return (

        <KeyCaptureContext hotkeys={hotkeys}>
            {children}
        </KeyCaptureContext>
    );
}

function CustomThemeProvider({ children }: { children: React.ReactNode }) {

    const theme = useMUItheme()

    return (

        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}

function useMUItheme() {

    const theme = useSelector((state: StateShape) => state.global.theme);
    return createMuiTheme({ theme });
}

export default function AppState({ children }: { children: React.ReactNode }) {

    return (
        <ReduxStateProvider store={reduxStateStore}>
        <CustomThemeProvider>
        <KeyCaptureContextProvider>
        <SimStateProvider>
        <StatsStateProvider>
            {children}
        </StatsStateProvider>
        </SimStateProvider>
        </KeyCaptureContextProvider>
        </CustomThemeProvider>
        </ReduxStateProvider>
    );
}