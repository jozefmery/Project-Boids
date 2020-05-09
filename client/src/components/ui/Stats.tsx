// TODO header

// import react
import React from "react";

// import p5
import P5Sketch, { P5 } from "../P5Sketch";

// import redux utilities
import { useSelector } from "react-redux";

// import hooks
import { useLanguageString } from "../../hooks/UseLanguageString";

// import UI elements
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../../stylers";

// import type information
import { StateShape } from "../../state/types";

function SelectedEntity() {

    const loop = (p5: P5) => {

        p5.background("red");
    };

    return (
        <div>
            <P5Sketch dimensions={{ width: 100, height: 100 }} loop={loop}/>
        </div>);
}

function EntityStats() {

    return (
        <div>
            
        </div>);
}

function FPS() {

    const fps = useSelector((state: StateShape) => state.stats.fps.current);

    return (
        <div>
            {/* {fps.toFixed(2)} */}
        </div>);
}

const panelWrapperStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",

    marginTop: "-1px",

    transform: (isOpen: boolean) => `translateX(${isOpen ? 0 : 100}%)`,

    transition: "transform .3s ease-in-out",

}, {}, [Style.verticalFlexBox]);

const panelStyle = Style.create({

    alignSelf: "stretch",

    borderStyle: "none",
    borderLeftStyle: "solid",

    padding: "15px",

}, {}, [Style.panel]);

const expansionPanelStyle = Style.create({

    borderWidth: "1px",
    borderStyle: "solid"

}, {

    [ColorTheme.DARK]: {

        backgroundColor: "#353535",
        borderColor: "#B9B9B9"
    },

    [ColorTheme.LIGHT]: {

        backgroundColor: "white",
        borderColor: "black"
    }

}, [Style.textColor]);

const expandIconStyle = Style.create({}, {}, [Style.textColor]);

const usePanelStyles = makeStyles(({ theme }: Theme) => ({
    
    panelWrapper: panelWrapperStyle.compose(theme),
    panel: panelStyle.compose(theme),
    expansionsPanel: expansionPanelStyle.compose(theme),
    expandIcon: expandIconStyle.compose(theme)
}));

export default function() {

    const isOpen = useSelector((state: StateShape) => state.stats.open);
    
    const classes = usePanelStyles(isOpen);

    const selectedEntity = useLanguageString("selectedEntity");
    const entities = useLanguageString("entities");

    return (
        <div className={classes.panelWrapper}>
            <div className={classes.panel}>
                <ExpansionPanel classes={{ root: classes.expansionsPanel }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                        classes={{ expandIcon: classes.expandIcon }}>
                        {selectedEntity}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <SelectedEntity />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel classes={{ root: classes.expansionsPanel }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                        classes={{ expandIcon: classes.expandIcon }}>
                        {entities}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <EntityStats />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel classes={{ root: classes.expansionsPanel }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        classes={{ expandIcon: classes.expandIcon }}>
                        FPS
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <FPS />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        </div>);
}