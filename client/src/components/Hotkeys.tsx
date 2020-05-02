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
import { RemoveUndefinedDeep } from "../types";
import { EventType } from "@dodmeister/hotkeys";

export const HotkeyContext = React.createContext<Context>(null as any);

type KeyCaptureContextProps = {

    children: React.ReactNode;
    tabIndex?: number;
    hotkeys?: ActionHotkeys;
};


type ActionHotkey = RemoveUndefinedDeep<NonNullable<ActionHotkeys[Action]>>;

function fillHotkeySettings(partialSettings: ActionHotkeys[Action]): ActionHotkey {

    // default settings
    const settings: ActionHotkey = {

        sequences: [],
        eventType: EventType.KEYDOWN,
        preventDefault: false
    };

    if(partialSettings) {

        // fill in options if the are available

        const { sequences, eventType, preventDefault } = partialSettings;

        settings.sequences = sequences;
        
        if(eventType) {

            settings.eventType = eventType;
        }

        if(preventDefault) {

            settings.preventDefault = preventDefault;
        }
    }

    return settings;
}

export function KeyCaptureContext({ children, tabIndex = 0, hotkeys = {} }: KeyCaptureContextProps) {

    const context = useRef(new Context());

    const actionMap = useAction();

    useEffect(() => {

        let actionName: Action;

        for(actionName in hotkeys) {

            // fill missing hotkey settings
            const { sequences, eventType, preventDefault } = fillHotkeySettings(hotkeys[actionName]);

            const handle = context.current.get(actionName);

            const action = actionMap[actionName];

            const callback = () => {

                action();
                return preventDefault;
            }

            if(handle) {

                // update sequences and callbacks
                handle.setSequences(sequences);
                handle.setCallback(callback);
                handle.setEventType(eventType)

            } else {

                context.current.add({   sequences, 
                                        callback, 
                                        id: actionName,
                                        eventType });
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