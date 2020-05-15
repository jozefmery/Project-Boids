/**
 * File: ui/Controls.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains components controlling the simulation.
 * 
 */

// import react
import React from "react";

// import redux utilities
import { useSelector } from "react-redux";

// import actions
import { useAction } from "../actions";

// import UI elements
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import CenterToArea from '@material-ui/icons/FilterCenterFocus';
import SpeedIcon from '@material-ui/icons/Speed';
import IncreaseIcon from '@material-ui/icons/Add';
import DecreaseIcon from '@material-ui/icons/Remove';
import VideocamIcon from '@material-ui/icons/Videocam';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

// import hooks
import { useLanguageString } from "../hooks/languageString";
import { useStringWithHotkeys } from "../hooks/stringWithHotkey";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../stylers";

// import type information
import { StateShape } from "../types/redux";
import { Function } from "../types/utils";

const buttonStyle = Style.create({}, {}, Style.controlButton);

const useButtonStyles = makeStyles(({ theme }: Theme) => ({
    
    button: buttonStyle.compose(theme)
}));

const tooltipStyle = Style.create({}, {}, Style.tooltip);

const useTooltipStyles = makeStyles(({ theme }: Theme) => ({
    
    tooltip: tooltipStyle.compose(theme)
}));

type ControlButtonProps = { 
    
    tooltip: string;
    content: React.ReactNode;
    callback: Function
};

function ControlButton({ tooltip, content, callback }: ControlButtonProps) {

    // get styles
    const { button } = useButtonStyles();
    const { tooltip: tooltipClass } = useTooltipStyles();

    return (
        <Tooltip title={tooltip} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
                <Button className={button} onClick={callback}>
                    {content}
                </Button>
        </Tooltip>);
}

const controlGroupStyle = Style.create({

    // enable positioning child relative to parent
    position: "relative",

    // grid
    display: "grid",
    gridTemplate: "1fr 1fr / 1fr 1fr",
    
    // spacing
    padding: "10px",
    gridGap: "5px 5px",

    // border
    borderRadius: "2px",

    "& > *:first-child": {

        // position on top of top-left corner
        position: "absolute",
        top: "0px",
        left: "0px",
        transform: "translate(-50%, -50%)",
        fontSize: "25px",

        // hide portion of border
        backgroundColor: "inherit"
    },

    "& > *:not(:first-child)": {

        justifySelf: "center"
    }

}, {

    [ColorTheme.DARK]: {

        border: "1px #a8a8a8 solid",
    },

    [ColorTheme.LIGHT]: {

        border: "1px black solid",
    }

}, [Style.textColor, 
    Style.panelBackground]);

const useControlGroupStyles = makeStyles(({ theme }: Theme) => ({

    group: controlGroupStyle.compose(theme)
}));

type ControlGroupProps = {

    icon: React.ReactNode;
    children: React.ReactNode;
}

function ControlGroup({ icon, children }: ControlGroupProps) {

    // get styles
    const { group } = useControlGroupStyles();

    return (
        <div className={group}>
            {icon}
            {children}
        </div>
    );
}

const textDisplayStyle = Style.create({

    alignSelf: "center"
});

const useTextDisplayStyles = makeStyles(({ theme }: Theme) => ({

    text: textDisplayStyle.compose(theme)
}));

type TextDisplayProps = {

    text: string;
    tooltip: string;
}

function TextDisplay({ text, tooltip }: TextDisplayProps) {

    // get styles
    const classes = useTextDisplayStyles();
    const { tooltip: tooltipClass } = useTooltipStyles();

    return (
        <Tooltip title={tooltip} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
                
            <div className={classes.text}>{text}</div>
        </Tooltip>);
}

function SpeedControls() {

    // get actions
    const [ increaseSimSpeed, 
            decreaseSimSpeed, 
            toggleSimRunning] = useAction(["increaseSimSpeed", "decreaseSimSpeed", "toggleSimRunning"]);

    // get state from redux
    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);
    const currentSpeed = useSelector((state: StateShape) => state.sim.speed.current);

    // get tooltips strings
    const tooltips = {

        toggler: useStringWithHotkeys(simRunning ? "pause" : "play", "toggleSimRunning"),
        increaseSpeed: useStringWithHotkeys("increaseSpeed", "increaseSimSpeed"),
        decreaseSpeed: useStringWithHotkeys("decreaseSpeed", "decreaseSimSpeed"),
        currentSpeed: useLanguageString("currentSpeed")
    };

    // define contents
    const content = {

        toggler: simRunning ? <PauseIcon /> : <PlayIcon />,
        increaseSpeed: <IncreaseIcon />,
        decreaseSpeed: <DecreaseIcon />,
        currentSpeed: `x${currentSpeed.toFixed(1)}`
    };

    return (
        <ControlGroup icon={<SpeedIcon />}>
            <ControlButton tooltip={tooltips.decreaseSpeed} content={content.decreaseSpeed} callback={() => decreaseSimSpeed()} />
            <ControlButton tooltip={tooltips.increaseSpeed} content={content.increaseSpeed} callback={() => increaseSimSpeed()} />
            <ControlButton tooltip={tooltips.toggler} content={content.toggler} callback={() => toggleSimRunning()} />
            <TextDisplay tooltip={tooltips.currentSpeed} text={content.currentSpeed} />
        </ControlGroup>);
}

function CameraControls() {

    // get actions
    const [zoomIn, zoomOut, centerCameraToArea] = useAction(["zoomIn", "zoomOut", "centerCameraToArea"]);

    // get state from redux
    const scale = useSelector((state: StateShape) => state.sim.camera.scale.current);

    // get language strings
    const zoomInTooltip = useStringWithHotkeys("zoomIn", "zoomIn");
    const zoomOutTooltip = useStringWithHotkeys("zoomOut", "zoomOut");
    const centerToAreaTooltip = useStringWithHotkeys("centerCameraToArea", "centerCameraToArea");
    const currentScale = useLanguageString("currentScale");

    return (
        <ControlGroup icon={<VideocamIcon />}>
            <ControlButton tooltip={zoomInTooltip} content={<ZoomInIcon />} callback={() => zoomIn()} />
            <ControlButton tooltip={zoomOutTooltip} content={<ZoomOutIcon />} callback={() => zoomOut()} />
            <ControlButton tooltip={centerToAreaTooltip} content={<CenterToArea />} callback={() => centerCameraToArea()} />
            <TextDisplay tooltip={currentScale} text={`x${scale.toFixed(2)}`} />
        </ControlGroup>);
}

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "center",
    alignSelf: "end",
    gridRow: "3 / 4",
    gridColumn: "1 / 2",
    zIndex: 0, 

    // grid
    display: "grid",
    gridTemplate: "1fr / 1fr 1fr",

    // spacing
    padding: "20px",
    columnGap: "15px",

    // style
    borderRadius: "3px 3px 0 0",
    borderStyle: "solid solid none solid"

}, {}, [Style.panel]);

const useControlStyles = makeStyles(({ theme }: Theme) => ({

    panel: panelStyle.compose(theme),
}));

// define react element
export default function Controls() {

    // get style classes
    const { panel } = useControlStyles();

    return (
        <div className={panel}>
            <SpeedControls />
            <CameraControls />
        </div>);
}