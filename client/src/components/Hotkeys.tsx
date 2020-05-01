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

// import actions
import { useAction, Action } from "../actions";

// import hotkeys
import Context from "@dodmeister/hotkeys";

// import type information
import { ActionHotkeys } from "../state/types";

export const HotkeyContext = React.createContext<Context>(null as any);

type KeyCaptureContextProps = {

    children: React.ReactNode;
    tabIndex?: number;
    hotkeys?: ActionHotkeys;
};

export function KeyCaptureContext({ children, tabIndex = 0, hotkeys = {} }: KeyCaptureContextProps) {

    const context = useRef(new Context());

    const actionMap = useAction();

    useEffect(() => {

        let action: Action;

        for(action in hotkeys) {

            let sequences: string | Array<string>;

            if(hotkeys[action] !== undefined) {

                // safety check provided above
                // safely cast to sequence definitions
                sequences = hotkeys[action] as string | Array<string>;

            } else {
                
                sequences = [];
            }

            const handle = context.current.get(action);

            if(handle) {

                // update sequences and callbacks
                handle.setSequences(sequences);
                handle.setCallback(actionMap[action]);

            } else {

                context.current.add({ sequences, callback: actionMap[action], id: action });
            }
        }

    }, [hotkeys, context, actionMap]);

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