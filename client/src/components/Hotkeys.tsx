/**
 * File: Hotkeys.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 30.4.2020
 * License: none
 * Description: Defines a hotkey capture context.
 * 
 */

// import react
import React, { useRef, useCallback, useEffect } from "react";

// import hotkeys
import Context from "@dodmeister/hotkeys";

export const HotkeyContext = React.createContext<Context>(null as any);

type KeyCaptureContextProps = {

    children: React.ReactNode;
    tabIndex?: number;
};

export function KeyCaptureContext({ children, tabIndex = 0 }: KeyCaptureContextProps) {

    const context = useRef(new Context());

    const cleanupContext = useCallback(() => {

        context.current.clearBlurHandler();

    }, [context]);

    useEffect(() => {

        return cleanupContext;

    }, [cleanupContext]);

    return (<div tabIndex={tabIndex}
                onKeyDown={(e) => {

                    if(e.repeat) return;

                    context.current.onKeyChanged(e.nativeEvent, true);
                }}
                onKeyUp={(e) => {

                    context.current.onKeyChanged(e.nativeEvent, false);
                }}>
                <HotkeyContext.Provider value={context.current}>
                    {children}
                </HotkeyContext.Provider>
            </div>);
}