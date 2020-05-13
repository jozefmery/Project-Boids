// TODO header

// import react
import React, { useCallback, useContext, useState } from "react";

// import state context
import { SimStateContext, StatsStateContext } from "../AppState";

// import p5
import P5Sketch, { P5 } from "./P5Sketch";

// import redux utilities and slices
import { useSelector } from "react-redux";

// import hooks
import { useLanguageString } from "../hooks/languageString";
import { useForceUpdate } from "../hooks/forceUpdate";

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

// import charts
import { LineChart, 
        Line, 
        CartesianGrid, 
        XAxis, 
        YAxis, 
        ReferenceLine, 
        Tooltip as ChartTooltip } from "recharts";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme, useCanvasStylers } from "../stylers";

// import utilities
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

// import type information
import { StateShape } from "../types/redux";
import { Position2D } from "../types/utils";
import { EntityType } from "../entities/entity";

function Elapsed() {

    useForceUpdate(100);

    const elapsed = useContext(SimStateContext).time.elapsed.current;
    const elapsedString = useLanguageString("elapsed");

    return (
        <div>
            {`${elapsedString}: ${(elapsed / 1000).toFixed(2)}s`}
        </div>);   
}

const tooltipStyle = Style.create({}, {}, Style.tooltip);

const useTooltipStyles = makeStyles(({ theme }: Theme) => ({
    
    tooltip: tooltipStyle.compose(theme)
}));

const verticalFlexBox = Style.create({

    "& > *:not(:last-child)": {

        marginRight: "15px"
    }

}, {}, Style.verticalFlexBox);

const useVerticalFlexBox = makeStyles(({ theme }: Theme) => ({
    
    container: verticalFlexBox.compose(theme)
}));

const horizontalFlexBox = Style.create({

    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "flex-start",

    "& > *:not(:last-child)": {

        marginBottom: "15px"
    }
});

const useHorizontalFlexBox = makeStyles(({ theme }: Theme) => ({
    
    container: horizontalFlexBox.compose(theme)
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

function ClearSelectedEntity({ clear }: { clear: () => any }) {

    const { tooltip: tooltipClass } = useTooltipStyles();
    const { button: buttonClass } = useButtonStyles();

    const clearSelection = useLanguageString("clearSelection");

    return (<Tooltip title={clearSelection} 
                placement="top" 
                TransitionComponent={Zoom}
                classes={{ tooltip: tooltipClass }}>
                <Button className={buttonClass} onClick={clear}>
                    <HighlightOffIcon />
                </Button>
            </Tooltip>);
}

function SelectedEntity() {

    useForceUpdate(100);

    const { container } = useHorizontalFlexBox();

    const simState = useContext(SimStateContext);

    const selectedEntity = simState.entities.context.current?.selectedEntity();

    const noSelectedEntity = useLanguageString("noSelectedEntity");

    if(selectedEntity === undefined) {

        return (<div>{noSelectedEntity}</div>);  
    }

    return (
        <div className={container}>
            <SelectedEntityType type={selectedEntity.type()} />
            <SelectedEntityID id={selectedEntity.id()} />
            <SelectedEntityPosition position={selectedEntity.position()} />
            <SelectedEntityHealth health={selectedEntity.health()} />
            <SelectedEntityForces velocity={selectedEntity.velocity()}
                maxVelocity={selectedEntity.options().speed}
                acceleration={selectedEntity.acceleration()}
                maxAcceleration={selectedEntity.options().maxForce.magnitude} />
            <ClearSelectedEntity clear={() => simState.entities.context.current?.clearSelectedEntity()} />
        </div>);
}

function useEntityChartStylers() {

    const theme = useSelector((state: StateShape) => state.global.theme);

    return {

        [ColorTheme.DARK]: {

            
        },

        [ColorTheme.LIGHT]: {

            
        }

    }[theme];
}


function EntityStats() {

    useForceUpdate(100);

    const stylers = useEntityChartStylers();

    return (
        <div>
            
        </div>);
}

function useFPSChartStylers() {

    const theme = useSelector((state: StateShape) => state.global.theme);

    return {

        [ColorTheme.DARK]: {

            average: "white",
            grid: "#cecece",
            line: "red"
        },

        [ColorTheme.LIGHT]: {

            average: "black",
            grid: "black",
            line: "red"
        }

    }[theme];
}

function FPS() {

    const [open, setOpen] = useState(false);

    useForceUpdate(100);

    const stylers = useFPSChartStylers();

    const { container } = useHorizontalFlexBox();

    const fpsStats = useContext(StatsStateContext).fps;

    const fps = fpsStats.current.current;
    const array = fpsStats.array.current;
    const average = array.reduce((total, current) => total + current.uv, 0) / array.length;

    const Chart = (
        <LineChart width={350} height={250} data={[...array]}>
            <CartesianGrid strokeDasharray="2 2" stroke={stylers.grid} />
            <XAxis tick={false} stroke={stylers.grid} />
            <YAxis stroke={stylers.grid} />
            <ReferenceLine strokeDasharray="10 10" stroke={stylers.average} y={average} />
            <Line type="monotone" dataKey="uv" stroke={stylers.line} />
        </LineChart>);

    return (
        <div className={container}>
            <div>
                {fps.toFixed(2)}
            </div>
            {!open ? Chart : null}
            {/* {!open ? <Button onClick={() => setOpen(true)}>asd</Button> : null} */}
        </div>);
}

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",

    marginTop: "-1px",

    fontSize: "17px",

    transform: (isOpen: boolean) => `translateX(${isOpen ? 0 : 100}%)`,

    transition: "transform .3s ease-in-out",

    borderStyle: "none",
    borderLeftStyle: "solid",

    padding: "15px",

    overflowY: "auto"

}, {}, [Style.panel, Style.textColor]);

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

}, Style.textColor);

const expandIconStyle = Style.create({}, {}, [Style.textColor]);

const usePanelStyles = makeStyles(({ theme }: Theme) => ({

    panel: panelStyle.compose(theme),
    expansionsPanel: expansionPanelStyle.compose(theme),
    expandIcon: expandIconStyle.compose(theme)
}));

export default function() {

    const isOpen = useSelector((state: StateShape) => state.global.statsOpen);
    
    const classes = usePanelStyles(isOpen);

    const selectedEntity = useLanguageString("selectedEntity");
    const entities = useLanguageString("entities");

    return (
        <div className={classes.panel}>
            <Elapsed />
            <ExpansionPanel classes={{ root: classes.expansionsPanel }} defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                    classes={{ expandIcon: classes.expandIcon }}>
                    {selectedEntity}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <SelectedEntity />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel classes={{ root: classes.expansionsPanel }} defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                    classes={{ expandIcon: classes.expandIcon }}>
                    {entities}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <EntityStats />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel classes={{ root: classes.expansionsPanel }} defaultExpanded={true}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{ expandIcon: classes.expandIcon }}>
                    FPS
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <FPS />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>);
}