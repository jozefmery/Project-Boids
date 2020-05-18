/**
 * File: types/stats.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Defines UI components for displaying entity/fps statistics.
 * 
 */

// import react
import React, { useCallback, useContext, useState, useRef } from "react";

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
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SaveIcon from '@material-ui/icons/SaveAlt';
import FoodIcon from '@material-ui/icons/Fastfood';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import VisibilityIcon from '@material-ui/icons/Visibility';

// import charts
import { LineChart, 
        Line, 
        CartesianGrid, 
        XAxis, 
        YAxis, 
        ReferenceLine } from "recharts";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme, useCanvasStylers } from "../stylers";

// import utilities
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

// import type information
import { StateShape } from "../types/redux";
import { Position2D } from "../types/utils";
import { SelectableEntity } from "../entities/entity";

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

    alignItems: "flex-start",

    "& > *:not(:last-child)": {

        marginBottom: "15px"
    }

}, {}, Style.verticalFlexBox);

const useVerticalFlexBox = makeStyles(({ theme }: Theme) => ({
    
    container: verticalFlexBox.compose(theme)
}));

const horizontalFlexBox = Style.create({

    alignItems: "center",

    "& > *:not(:last-child)": {

        marginRight: "15px"
    }

}, {}, Style.horizontalFlexBox);

const useHorizontalFlexBox = makeStyles(({ theme }: Theme) => ({
    
    container: horizontalFlexBox.compose(theme)
}));

function SelectedEntityType({ type }: { type: SelectableEntity }) {

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

    const { container } = useHorizontalFlexBox();
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

    const { container } = useHorizontalFlexBox();
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

    const { container } = useHorizontalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const healthString = useLanguageString("health");

    return (
        <Tooltip title={healthString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <FavoriteIcon />
                <div>{Math.round(health)} / 100</div>
            </div>
        </Tooltip>);
}

function SelectedEntityHunger({ hunger }: { hunger: number }) {

    const { container } = useHorizontalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const hungerString = useLanguageString("hunger");

    return (
        <Tooltip title={hungerString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <FoodIcon />
                <div>{Math.round(hunger)} / 100</div>
            </div>
        </Tooltip>);
}

function SelectedEntityAge({ age, maxAge }: { age: number, maxAge: number }) {

    const { container } = useHorizontalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const ageString = useLanguageString("age");

    return (
        <Tooltip title={ageString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <HourglassFullIcon />
                <div>{Math.round(age)} / {Math.round(maxAge)}</div>
            </div>
        </Tooltip>);
}

function SelectedEntityPerception({ radius, angle }: { radius: number, angle: number }) {

    const { container } = useHorizontalFlexBox();
    const { tooltip: tooltipClass } = useTooltipStyles();

    const perceptionAngleString = useLanguageString("perceptionAngle");
    const perceptionRadiusString = useLanguageString("perceptionRadius");

    return (
        <Tooltip title={`${perceptionAngleString} & ${perceptionRadiusString}`} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <div className={container}>
                <VisibilityIcon />
                <div>{`${angle}° & ${radius}`}</div>
            </div>
        </Tooltip>);
}

function SelectedEntityForce({ force, maxForce, tooltip }: 
                            { force: Position2D, maxForce: number, tooltip: string }) {

    const backgroundStyler = useCanvasStylers("forceBackground");
    const circleStyler = useCanvasStylers("forceCircle");
    const arrowStyler = useCanvasStylers("forceArrow");

    const { container } = useHorizontalFlexBox();
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

    useForceUpdate(1000);

    const { container } = useVerticalFlexBox();

    const simState = useContext(SimStateContext);

    const selectedEntity = simState.entities.context.current?.selectedEntity();

    const noSelectedEntity = useLanguageString("noSelectedEntity");

    if(selectedEntity === undefined) {

        return (<div>{noSelectedEntity}</div>);  
    }

    return (
        <div className={container}>
            <SelectedEntityType type={selectedEntity.type() as SelectableEntity} />
            <SelectedEntityID id={selectedEntity.id()} />
            <SelectedEntityPosition position={selectedEntity.position()} />
            <SelectedEntityPerception angle={selectedEntity.options().perception.angle} radius={selectedEntity.options().perception.radius} />
            <SelectedEntityHealth health={selectedEntity.health()} />
            <SelectedEntityHunger hunger={selectedEntity.hunger()} />
            <SelectedEntityAge age={selectedEntity.age()} maxAge={selectedEntity.options().maxAge} />
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

            grid: "#cecece",
            predators: "red",
            preys: "#00DA09",

        },

        [ColorTheme.LIGHT]: {

            grid: "black",
            predators: "red",
            preys: "#00DA09",
        }

    }[theme];
}

function EntityStats() {

    useForceUpdate(1000);

    const zoomInString = useLanguageString("zoomIn");
    const zoomOutString = useLanguageString("zoomOut");
    const saveAsImg = useLanguageString("saveAsImg");
    const predatorsString = useLanguageString("predators");
    const preysString = useLanguageString("preys");
    
    const { button : buttonClass} = useButtonStyles();
    const { tooltip : tooltipClass } = useTooltipStyles();

    const [zoomed, setZoomed] = useState(false);
    const canvasRef = useRef(null);

    const stylers = useEntityChartStylers();

    const { container: vFlex } = useVerticalFlexBox();
    const { container: hFlex } = useHorizontalFlexBox(); 

    const entityStats = useContext(StatsStateContext).entities;

    const predators = entityStats.predators.current;
    const preys = entityStats.preys.current;
    const array = entityStats.array.current;

    return (
        <div className={vFlex}>
            <div>
                {`${predatorsString}: ${predators}`}
            </div>
            <div>
                {`${preysString}: ${preys}`}
            </div>
            <div ref={canvasRef}>
                <LineChart width={zoomed ? 700 : 350} height={zoomed ? 500 : 250} data={[...array]}>
                    <CartesianGrid strokeDasharray="2 2" stroke={stylers.grid} />
                    <XAxis tick={false} stroke={stylers.grid} />
                    <YAxis stroke={stylers.grid} />
                    <Line type="monotone" dataKey="preys" stroke={stylers.preys} strokeWidth={3} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="predators" stroke={stylers.predators} strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </div>
            <div className={hFlex}>
                <Tooltip title={zoomed ? zoomOutString : zoomInString} 
                        placement="top" 
                        TransitionComponent={Zoom}
                        classes={{ tooltip: tooltipClass }}>
                    <Button onClick={() => setZoomed(last => !last)} className={buttonClass}>
                        {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                    </Button>
                </Tooltip>
                <Tooltip title={saveAsImg} 
                        placement="top" 
                        TransitionComponent={Zoom}
                        classes={{ tooltip: tooltipClass }}>
                    <Button onClick={() => {

                        const node = canvasRef.current;

                        if(node) {

                            domtoimage.toBlob(node).then(blob => saveAs(blob, "entity-chart.png"));
                        }

                    }} className={buttonClass}>
                        <SaveIcon />
                    </Button>
                </Tooltip>
            </div>
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

    useForceUpdate(1000);

    const zoomInString = useLanguageString("zoomIn");
    const zoomOutString = useLanguageString("zoomOut");
    const saveAsImg = useLanguageString("saveAsImg");
    const currentString = useLanguageString("current");
    const averageString = useLanguageString("average");
    
    const { button : buttonClass} = useButtonStyles();
    const { tooltip : tooltipClass } = useTooltipStyles();

    const [zoomed, setZoomed] = useState(false);
    const canvasRef = useRef(null);

    const stylers = useFPSChartStylers();

    const { container: vFlex } = useVerticalFlexBox();
    const { container: hFlex } = useHorizontalFlexBox(); 

    const fpsStats = useContext(StatsStateContext).fps;

    const fps = fpsStats.current.current;
    const array = fpsStats.array.current;
    const average = array.reduce((total, current) => total + current.fps, 0) / array.length;

    return (
        <div className={vFlex}>
            <div>
                {`${currentString}: ${fps.toFixed(2)}`}
            </div>
            <div>
                {`${averageString}: ${average.toFixed(2)}`}
            </div>
            <div ref={canvasRef}>
                <LineChart width={zoomed ? 700 : 350} height={zoomed ? 500 : 250} data={[...array]}>
                    <CartesianGrid strokeDasharray="2 2" stroke={stylers.grid} />
                    <XAxis tick={false} stroke={stylers.grid} />
                    <YAxis stroke={stylers.grid} />
                    <Line type="monotone" dataKey="fps" stroke={stylers.line} strokeWidth={3} dot={false} isAnimationActive={false} />
                    <ReferenceLine strokeDasharray="10 10" stroke={stylers.average} y={average} strokeWidth={3} />
                </LineChart>
            </div>
            <div className={hFlex}>
                <Tooltip title={zoomed ? zoomOutString : zoomInString} 
                        placement="top" 
                        TransitionComponent={Zoom}
                        classes={{ tooltip: tooltipClass }}>
                    <Button onClick={() => setZoomed(last => !last)} className={buttonClass}>
                        {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                    </Button>
                </Tooltip>
                <Tooltip title={saveAsImg} 
                        placement="top" 
                        TransitionComponent={Zoom}
                        classes={{ tooltip: tooltipClass }}>
                    <Button onClick={() => {

                        const node = canvasRef.current;

                        if(node) {

                            domtoimage.toBlob(node).then(blob => saveAs(blob, "fps-chart.png"));
                        }

                    }} className={buttonClass}>
                        <SaveIcon />
                    </Button>
                </Tooltip>
            </div>
        </div>);
}

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",
    zIndex: 1,

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

    const currentPanel = useSelector((state: StateShape) => state.global.sidePanel);

    const isOpen = currentPanel === "stats";
    
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