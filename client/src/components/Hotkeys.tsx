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

        let actionName: Action;

        for(actionName in hotkeys) {
            
            const options = hotkeys[actionName];

            if(options === undefined) continue;

            const { preventDefault, ...rest } = options;

            const action = actionMap[actionName];
            const callback = () => {
                
                action();
                return preventDefault;
            }

            const handle = context.current.get(actionName);
            
            if(handle) {
                
                // update options
                handle.setOptions({ callback, ...rest });

            } else {

                context.current.add({ callback, id: actionName, ...rest });
            }
        }

    }, [hotkeys, context, actionMap]);

    const cleanupContext = useCallback(() => {

        context.current.clearBlurHandler();

    }, [context]);

    useEffect(() => {

        return cleanupContext;

    }, [cleanupContext]);

    return (<div style={{ display: "contents"}} 
                tabIndex={tabIndex}
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