/**
 * File: Controls.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains components controlling the simulation.
 * 
 */

// import react
import React from "react";

// import redux utilities and slices
import { useSelector, useDispatch } from "react-redux";
import { toggleSimRunning, centerCameraToArea, increaseSpeed, decreaseSpeed, changeCameraScale } from "../../state/simSlice";

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
import { useLanguageString } from "../../hooks/UseLanguageString";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../../stylers";

// import type information
import { StateShape } from "../../state/types";
import { Function } from "../../types";

const buttonStyle = Style.create({}, {}, [Style.controlButton, Style.colorTransition]);

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
    Style.panelBackground,
    Style.colorTransition]);

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

    // get state and dispatch from redux
    const dispatch = useDispatch();
    const simRunning = useSelector((state: StateShape) => state.sim.speed.running);
    const currentSpeed = useSelector((state: StateShape) => state.sim.speed.current);

    // get tooltips strings
    const tooltips = {

        toggler: useLanguageString(simRunning ? "pause" : "play"),
        increaseSpeed: useLanguageString("increaseSpeed"),
        decreaseSpeed: useLanguageString("decreaseSpeed"),
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
            <ControlButton tooltip={tooltips.increaseSpeed} content={content.increaseSpeed} callback={() => dispatch(increaseSpeed())} />
            <ControlButton tooltip={tooltips.decreaseSpeed} content={content.decreaseSpeed} callback={() => dispatch(decreaseSpeed())} />
            <ControlButton tooltip={tooltips.toggler} content={content.toggler} callback={() => dispatch(toggleSimRunning())} />
            <TextDisplay tooltip={tooltips.currentSpeed} text={content.currentSpeed} />
        </ControlGroup>);
}

function CameraControls() {

    // get state and dispatch from redux
    const dispatch = useDispatch();
    const scale = useSelector((state: StateShape) => state.sim.camera.scale.current);

    // get language strings
    const centerToArea = useLanguageString("centerToArea");
    const zoomIn = useLanguageString("zoomIn");
    const zoomOut = useLanguageString("zoomOut");
    const currentScale = useLanguageString("currentScale");

    return (
        <ControlGroup icon={<VideocamIcon />}>
            <ControlButton tooltip={zoomIn} content={<ZoomInIcon />} callback={() => dispatch(changeCameraScale(1))} />
            <ControlButton tooltip={zoomOut} content={<ZoomOutIcon />} callback={() => dispatch(changeCameraScale(-1))} />
            <ControlButton tooltip={centerToArea} content={<CenterToArea />} callback={() => dispatch(centerCameraToArea())} />
            <TextDisplay tooltip={currentScale} text={`x${scale.toFixed(2)}`} />
        </ControlGroup>);
}

const panelStyle = Style.create({

    // position
    position: "fixed",

    // grid
    display: "grid",
    gridTemplate: "1fr / 1fr 1fr",

    // center horizontally
    left: "50%",
    transform: "translate(-50%)",
    bottom: "0px",

    // spacing
    padding: "20px",
    columnGap: "15px",

    // style
    borderRadius: "3px 3px 0 0",
    borderStyle: "solid solid none solid"

}, {}, [Style.panel, Style.colorTransition]);

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