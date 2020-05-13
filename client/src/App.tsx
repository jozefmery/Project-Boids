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
import React from "react";

import AppState from "./AppState";
import AppDisplay from "./AppDisplay";

export default function App() {

    return (
        <AppState>
            <AppDisplay />
        </AppState>
    );
}
