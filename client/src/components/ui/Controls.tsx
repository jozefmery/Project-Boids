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
import { toggleSimRunning } from "../../state/simSlice";

// import UI elements
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

// import hooks
import { useLanguageString } from "../../hooks/UseLanguageString";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style } from "../../stylers";

// import type information
import { StateShape } from "../../state/defaultState";

// define styles
const UIPanelStyle: Style = Style.create({

    // position
    position: "fixed",

    // center horizontally
    left: "50%",
    transform: "translate(-50%)",
    bottom: "0px",

    // spacing
    padding: "20px",

    // style
    borderRadius: "3px 3px 0 0",
    borderStyle: "solid solid none solid"

}, {}, [Style.UIPanel, Style.verticalFlexBox, Style.colorTransition]);

const buttonStyle: Style = Style.create({}, {}, [Style.controlButton, Style.colorTransition]);

const tooltipStyle: Style = Style.create(undefined, undefined, Style.simpleTooltip);

const useControlStyles = makeStyles(({ theme }: Theme) => ({

    panel: UIPanelStyle.compose(theme),
    button: buttonStyle.compose(theme),
    tooltip: tooltipStyle.compose(theme)
}));

// define helper functions
function useIcon() {

    // get data from redux state
    const simRunning = useSelector((state: StateShape) => state.sim.running);

    return {

        playToggler: simRunning ? <PauseIcon /> : <PlayIcon />
    }
}

function useTooltip() {

    // get data from redux state
    const simRunning = useSelector((state: StateShape) => state.sim.running);
    
    // get strings
    const play = useLanguageString("play");
    const pause = useLanguageString("pause");

    return {

        playToggler: simRunning ? pause : play
    }
}

// define react element
export default function Controls() {

    const icons = useIcon();
    const tooltips = useTooltip();

    // get style classes
    const classes = useControlStyles();

    const dispatch = useDispatch();

    return (
        <div className={classes.panel}>
            <Tooltip title={tooltips.playToggler} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: classes.tooltip }}>
                <Button className={classes.button} onClick={() => dispatch(toggleSimRunning()) }>
                    {icons.playToggler}
                </Button>
            </Tooltip>
        </div>);
}