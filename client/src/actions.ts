/**
 * File: actions.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Defines actions which wrap various state mutators used by
 *              UI components and hotkey callbacks.
 * 
 */

// import react
import { useCallback, } from "react";

// import redux utilities and actions
import { useDispatch, useSelector } from "react-redux";

import {

    toggleTheme,
    setLanguage,
    toggleStatsOpen,
    toggleSimSetupOpen

} from "./state/slices/global";

import {

    toggleSimRunning,
    increaseSpeed,
    decreaseSpeed,

    centerCameraToArea,
    changeCameraScale,

    setCameraMoveDirection,
    resetCameraMoveDirection

} from "./state/slices/sim";

// import type information
import { StateShape } from "./types/redux";
import { Languages } from "./lang/all";
import { Function } from "./types/utils";

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

function useToggleSimRunning() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(toggleSimRunning());

    }, [dispatch]);
}

function useIncreaseSimSpeed() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(increaseSpeed());

    }, [dispatch]);
}

function useDecreaseSimSpeed() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(decreaseSpeed());

    }, [dispatch]);
}

function useCenterCameraToArea() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(centerCameraToArea());

    }, [dispatch]);
}

function useZoomIn() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(changeCameraScale(1));

    }, [dispatch]);
}

function useZoomOut() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(changeCameraScale(-1));

    }, [dispatch]);
}

function useSetMoveCameraDirection(direction: keyof StateShape["sim"]["camera"]["movement"]) {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(setCameraMoveDirection(direction));

    }, [dispatch, direction]);
}

function useResetMoveCameraDirection(direction: keyof StateShape["sim"]["camera"]["movement"]) {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(resetCameraMoveDirection(direction));

    }, [dispatch, direction]);
}

function useToggleStatsOpen() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(toggleStatsOpen());

    }, [dispatch]);
}

function useToggleSimSetupOpen() {

    const dispatch = useDispatch();

    return useCallback(() => {

        dispatch(toggleSimSetupOpen());

    }, [dispatch]);
}

export const actionList = [

    "toggleTheme",
    "setLanguage",
    "cycleLanguages",
    "toggleSimRunning",
    "increaseSimSpeed",
    "decreaseSimSpeed",
    "centerCameraToArea",
    "zoomIn",
    "zoomOut",
    "setCameraMoveUp",
    "resetCameraMoveUp",

    "setCameraMoveRight",
    "resetCameraMoveRight",

    "setCameraMoveDown",
    "resetCameraMoveDown",

    "setCameraMoveLeft",
    "resetCameraMoveLeft",

    "toggleStatsOpen",
    "toggleSimSetupOpen"

] as const;

export type Action = typeof actionList[number];

type ActionMap = { [index in Action]: Function };

function useActionMap(): ActionMap {

    const toggleTheme = useToggleTheme();
    const setLanguage = useSetLanguage();
    const cycleLanguages = useCycleLanguages();
    const toggleSimRunning = useToggleSimRunning();
    const increaseSimSpeed = useIncreaseSimSpeed();
    const decreaseSimSpeed = useDecreaseSimSpeed();
    const centerCameraToArea = useCenterCameraToArea();
    const zoomIn = useZoomIn();
    const zoomOut = useZoomOut();
    const setCameraMoveUp = useSetMoveCameraDirection("up");
    const resetCameraMoveUp = useResetMoveCameraDirection("up");
    const setCameraMoveRight = useSetMoveCameraDirection("right");
    const resetCameraMoveRight = useResetMoveCameraDirection("right");
    const setCameraMoveDown = useSetMoveCameraDirection("down");
    const resetCameraMoveDown = useResetMoveCameraDirection("down");
    const setCameraMoveLeft = useSetMoveCameraDirection("left");
    const resetCameraMoveLeft = useResetMoveCameraDirection("left");
    const toggleStatsOpen = useToggleStatsOpen();
    const toggleSimSetupOpen = useToggleSimSetupOpen();

    return {

        toggleTheme,
        setLanguage,
        cycleLanguages,
        toggleSimRunning,
        increaseSimSpeed,
        decreaseSimSpeed,
        centerCameraToArea,
        zoomIn,
        zoomOut,
        setCameraMoveUp,
        resetCameraMoveUp,
        setCameraMoveRight,
        resetCameraMoveRight,
        setCameraMoveDown,
        resetCameraMoveDown,
        setCameraMoveLeft,
        resetCameraMoveLeft,
        toggleStatsOpen,
        toggleSimSetupOpen
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