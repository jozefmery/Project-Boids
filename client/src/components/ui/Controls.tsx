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

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style } from "../../stylers";

// import type information
import { StateShape } from "../../state/defaultState";

// import language data
import languageData from "../../lang/all";

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

}, {}, ["UIPanel", "VerticalFlexBox", "ColorTransition"]);

const buttonStyle: Style = Style.create({

    "&:not(:last-child)": {

        marginRight: "20px"
    },

}, {}, ["ControlButton", "ColorTransition"]);

const tooltipStyle: Style = Style.create(undefined, undefined, "SimpleTooltip");

const useControlStyles = makeStyles(({ theme }: Theme) => ({

    panel: UIPanelStyle.compose(theme),
    button: buttonStyle.compose(theme),
    tooltip: tooltipStyle.compose(theme)
}));

type ControlElements = "playToggler";

const mapStateToProps = ({ language, sim }: StateShape) => ({ language, sim });
type ControlsProps = ReturnType<typeof mapStateToProps>;

// define helper functions
function getIcon(props: ControlsProps, element: ControlElements): React.ReactNode {

    // --- shorthands
    const simRunning = props.sim.running;
    // --- shorthands

    switch(element) {

        case "playToggler":

            return simRunning ? <PauseIcon /> : <PlayIcon />;
    }
}

function getTooltip(props: ControlsProps, element: ControlElements): string {

    // --- shorthands
    const simRunning = props.sim.running;
    const currentLanguage = languageData[props.language];
    // --- shorthands

    switch(element) {

        case "playToggler":

            return simRunning ? currentLanguage.pause : currentLanguage.play;
    }
}

// define react element
export default function Controls() {

    // get data from redux store
    const props = useSelector(mapStateToProps);

    // get style classes
    const classes = useControlStyles();

    const dispatch = useDispatch();

    return (
        <div className={classes.panel}>
            <Tooltip title={getTooltip(props, "playToggler")} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: classes.tooltip }}>
                <Button className={classes.button} onClick={() => dispatch(toggleSimRunning()) }>
                    {getIcon(props, "playToggler")}
                </Button>
            </Tooltip>
        </div>);
}