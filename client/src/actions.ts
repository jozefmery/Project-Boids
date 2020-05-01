// TODO action header

// import react
import { useCallback, } from "react";

// import redux utilities and actions
import { useDispatch, useSelector } from "react-redux";

import {

    toggleTheme,
    setLanguage

} from "./state/globalSlice";

// import type information
import { StateShape } from "./state/types";
import { Languages } from "./lang/all";
import { Function } from "./types";

function useToggleTheme() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(toggleTheme());

    }, [dispatch]);
}

function useSetLanguage() {

    const dispatch = useDispatch();

    return useCallback((language: Languages) => {

        dispatch(setLanguage(language));

    }, [dispatch]);

}

function useCycleLanguages() {
    
    const dispatch = useDispatch();
    const current = useSelector((state: StateShape) => state.global.language);

    const languageList = Object.values(Languages);
    
    return useCallback(() => {

        const index = languageList.indexOf(current);
    
        const next = languageList[(index + 1) % languageList.length];

        dispatch(setLanguage(next));

    }, [dispatch, current, languageList]);
}

export const actionList = [

    "toggleTheme",
    "setLanguage",
    "cycleLanguages"

] as const;

export type Action = typeof actionList[number];

type ActionMap = { [index in Action]: Function };

function useActionMap(): ActionMap {

    const toggleTheme = useToggleTheme();
    const setLanguage = useSetLanguage();
    const cycleLanguages = useCycleLanguages();

    return {

        toggleTheme,
        setLanguage,
        cycleLanguages
    };
}

export function useAction(actions: Action): Function;
export function useAction(actions: Array<Action>): Array<Function>;
export function useAction(): ActionMap;

export function useAction(actions?: Action | Array<Action>): Function | Array<Function> | ActionMap {

    const actionMap = useActionMap()

    if(actions instanceof Array) {

        return actions.map(action => actionMap[action]);

    } else if(actions === undefined) {

        return actionMap;

    } else {

        return actionMap[actions];
    }
}