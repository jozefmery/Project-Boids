// TODO header

// import react
import React, { useCallback } from "react";

// import p5
import P5Sketch, { P5 } from "../P5Sketch";

// import redux utilities and slices
import { useSelector, useDispatch } from "react-redux";
import { setSelectedEntity } from "../../state/statsSlice";

// import hooks
import { useLanguageString } from "../../hooks/UseLanguageString";

// import UI elements
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PlaceIcon from '@material-ui/icons/Place';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FingerprintIcon from '@material-ui/icons/Fingerprint';

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme, useCanvasStylers } from "../../stylers";

// import type information
import { StateShape } from "../../state/types";
import { Position2D } from "../../types";
import { EntityType } from "../../entities/entity";

const tooltipStyle = Style.create({}, {}, Style.tooltip);

const useTooltipStyles = makeStyles(({ theme }: Theme) => ({
    
    tooltip: tooltipStyle.compose(theme)
}));

function SelectedEntityType({ type }: { type: EntityType }) {

    const { tooltip: tooltipClass } = useTooltipStyles();

    const typeString = useLanguageString(type);
    const entityTypeString = useLanguageString("entityType");

    return (
            <Tooltip title={entityTypeString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
                <div>
                    {typeString}
                </div>
            </Tooltip>);
}

const verticalFlexBox = Style.create({

    "& > *:first-child": {

        marginRight: "15px"
    }

}, {}, Style.verticalFlexBox);

const useVerticalFlexBox = makeStyles(({ theme }: Theme) => ({
    
    container: verticalFlexBox.compose(theme)
}));

function SelectedEntityID({ id }: { id: string }) {

    const { container } = useVerticalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const idString = useLanguageString("id");

    return (
        <Tooltip title={idString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <FingerprintIcon />
                <div>{id}</div>
            </div>
        </Tooltip>);
}

function SelectedEntityPosition({ position }: { position: Position2D }) {

    const { container } = useVerticalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const positionString = useLanguageString("position");

    return (
        <Tooltip title={positionString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <PlaceIcon />
                <div>{`X: ${position.x.toFixed(1)} Y: ${position.y.toFixed(1)}`}</div>
            </div>
        </Tooltip>);
}

function SelectedEntityHealth({ health }: { health: number }) {

    const { container } = useVerticalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const healthString = useLanguageString("health");

    return (
        <Tooltip title={healthString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <FavoriteIcon />
                <div>{Math.round(health)}</div>
            </div>
        </Tooltip>);
}

function SelectedEntityForce({ force, maxForce, tooltip }: 
                            { force: Position2D, maxForce: number, tooltip: string }) {

    const backgroundStyler = useCanvasStylers("forceBackground");
    const circleStyler = useCanvasStylers("forceCircle");
    const arrowStyler = useCanvasStylers("forceArrow");

    const { container } = useVerticalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const vector = new P5.Vector();
    vector.set(force.x, force.y);

    const loop = useCallback((p5: P5) => {

        backgroundStyler(p5);

        circleStyler(p5);

        p5.translate(p5.width / 2, p5.height / 2);

        const circleRadius = Math.min(p5.width, p5.height);

        p5.circle(0, 0, circleRadius);

        const magnitude = vector.mag();
        
        if(magnitude > 3) {
            
            arrowStyler(p5);

            p5.rotate(vector.heading());
            
            const length = p5.map(vector.mag(), 0, maxForce, 0, circleRadius / 2, true);
            p5.line(0, 0, length - 3, 0);
            
            p5.translate(length - 3, 0);
            
            p5.triangle(0, 0, -5, 5, -5, -5);
        }        

    }, [backgroundStyler, circleStyler, arrowStyler, vector, maxForce]);

    return (
        <Tooltip title={tooltip} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <P5Sketch dimensions={{ width: 100, height: 100 }} loop={loop} />
            <div>{vector.mag().toFixed(2)}</div>
            </div>
        </Tooltip>);
}

function SelectedEntityForces({ velocity, maxVelocity, acceleration, maxAcceleration }: 
                                { velocity: Position2D, maxVelocity: number, 
                                acceleration: Position2D, maxAcceleration: number}) {

    const velocityString = useLanguageString("velocity");
    const accelerationString = useLanguageString("acceleration");

    return (
        <>
            <SelectedEntityForce tooltip={velocityString} 
                                    force={velocity} 
                                    maxForce={maxVelocity} />
            <SelectedEntityForce tooltip={accelerationString} 
                                    force={acceleration} 
                                    maxForce={maxAcceleration} />
        </>);
}

const buttonStyle = Style.create({}, {}, Style.controlButton);

const useButtonStyles = makeStyles(({ theme }: Theme) => ({
    
    button: buttonStyle.compose(theme)
}));

function ClearSelectedEntity() {

    const dispatch = useDispatch();

    const { tooltip: tooltipClass } = useTooltipStyles();
    const { button: buttonClass } = useButtonStyles();

    const clearSelection = useLanguageString("clearSelection");

    return (<Tooltip title={clearSelection} 
                placement="top" 
                TransitionComponent={Zoom}
                classes={{ tooltip: tooltipClass }}>
                <Button className={buttonClass} onClick={() => dispatch(setSelectedEntity(undefined))}>
                    <HighlightOffIcon />
                </Button>
            </Tooltip>);
}

const useSelectedEntityStyles = makeStyles({

    container: {

        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "flex-start",

        "& > div:not(:last-child)": {

            marginBottom: "15px"
        }
    }
});

function SelectedEntity() {

    const { container } = useSelectedEntityStyles();

    const selectedEntity = useSelector((state: StateShape) => state.stats.entities.selected);

    const noSelectedEntity = useLanguageString("noSelectedEntity");

    if(selectedEntity === undefined) {

        return (<div>{noSelectedEntity}</div>);  
    }

    return (
        <div className={container}>
            <SelectedEntityType type={selectedEntity.type} />
            <SelectedEntityID id={selectedEntity.id} />
            <SelectedEntityPosition position={selectedEntity.position} />
            <SelectedEntityHealth health={selectedEntity.health} />
            <SelectedEntityForces velocity={selectedEntity.velocity}
                maxVelocity={selectedEntity.maxVelocity}
                acceleration={selectedEntity.acceleration}
                maxAcceleration={selectedEntity.maxAcceleration} />
            <ClearSelectedEntity />
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
            {fps.toFixed(2)}
        </div>);
}

const panelWrapperStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",

    marginTop: "-1px",

    fontSize: "17px",

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
                <ExpansionPanel classes={{ root: classes.expansionsPanel }} defaultExpanded={true}>
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