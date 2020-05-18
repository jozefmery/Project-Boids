/**
 * File: ui/SimSetup.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 18.5.2020
 * License: none
 * Description: Defines a side panel which enables setting up the simulation.
 * 
 */

import React, { useContext, useState } from "react";

// import redux utilities
import { useSelector, useDispatch } from "react-redux";

// import actions
import { setSimArea, centerCameraToArea } from "../state/slices/sim";

// import state providers
import { HotkeyContext } from "../Hotkeys";
import { SimStateContext, StatsStateContext } from "../AppState";

// import hooks
import { useLanguageString } from "../hooks/languageString";

// import components
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import DoneIcon from "@material-ui/icons/Done";
import Checkbox from "@material-ui/core/Checkbox";  
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style } from "../stylers";

// import type information
import { StateShape } from "../types/redux";
import { Dimensions2D } from "../types/utils";
import { ContextOptions } from "../entities/entity";

const tooltipStyle = Style.create({}, {}, Style.tooltip);

const useTooltipStyles = makeStyles(({ theme }: Theme) => ({
    
    tooltip: tooltipStyle.compose(theme)
}));

const buttonStyle = Style.create({}, {}, Style.controlButton);

const useButtonStyles = makeStyles(({ theme }: Theme) => ({
    
    button: buttonStyle.compose(theme)
}));

const checkBoxStyles = Style.create({}, {}, [Style.textColor]);

const useCheckBoxStyles = makeStyles(({ theme }) => ({

    checkbox: checkBoxStyles.compose(theme),
}));

function DrawQuadTree({ onChange, checked }: { onChange: (checked: boolean) => any, checked: boolean }) {

    const { checkbox } = useCheckBoxStyles();

    const drawTreeString = useLanguageString("drawQuadtree");

    return (
        <div>
            {drawTreeString}: <Checkbox classes={{ root: checkbox }} 
                                        color="default"
                                        onChange={(_, checked) => onChange(checked)}
                                        checked={checked} />
        </div>);
}

const formControlStyles = Style.create({

    minWidth: "120px"

}, {}, Style.textColor);

const inputLabelStyles = Style.create({}, {}, Style.textColor);

const selectStyles = Style.create({}, {}, Style.textColor);

const selectIconStyles = Style.create({}, {}, Style.textColor);

const selectMenu: Style = Style.create({}, {}, Style.menu);

const selectMenuItem: Style = Style.create({}, {}, Style.menuItem);

const useSelectStyles = makeStyles(({ theme }) => ({

    formControl: formControlStyles.compose(theme),
    label: inputLabelStyles.compose(theme),
    select: selectStyles.compose(theme),
    selectIcon: selectIconStyles.compose(theme),
    menu: selectMenu.compose(theme),
    item: selectMenuItem.compose(theme)
}));

function SelectArea({ onChange, value }: { onChange: (value: number) => any, value: number }) {

    const classes = useSelectStyles();

    const areaString = useLanguageString("area");
    const verySmallString = useLanguageString("verySmall");
    const smallString = useLanguageString("small");
    const mediumString = useLanguageString("medium");
    const largeString = useLanguageString("large");
    const veryLargeString = useLanguageString("veryLarge");

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel classes={{ root: classes.label }}>{areaString}</InputLabel>
                <Select value={value} onChange={(event) => onChange(event.target.value as number)}
                        MenuProps={{ classes: { paper: classes.menu }}}
                        classes={{ root: classes.select, icon: classes.selectIcon }}>
                    <MenuItem value={0} classes={{ root: classes.item }}>{verySmallString} 500 x 500</MenuItem>
                    <MenuItem value={1} classes={{ root: classes.item }}>{smallString} 2000 x 2000</MenuItem>
                    <MenuItem value={2} classes={{ root: classes.item }}>{mediumString} 5000 x 5000</MenuItem>
                    <MenuItem value={3} classes={{ root: classes.item }}>{largeString} 10000 x 10000</MenuItem>
                    <MenuItem value={4} classes={{ root: classes.item }}>{veryLargeString} 20000 x 20000</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

const inputStyle = Style.create({}, {}, Style.textColor);
const inputLabelStyle = Style.create({}, {}, Style.textColor);
const inputAdormentStyle = Style.create({}, {}, Style.textColor);
const inputHelperStyle = Style.create({}, {}, Style.textColor);

const useInputStyle = makeStyles(({ theme }) => ({

    input: inputStyle.compose(theme),
    label: inputLabelStyle.compose(theme),
    adorment: inputAdormentStyle.compose(theme),
    helper: inputHelperStyle.compose(theme)

}));

type InputOnChange = (value: string) => any;

function Input({ value, label, suffix = "", onChange, error, helper }: 
    
    { value: string, label: string, suffix?: string, onChange: InputOnChange, error: boolean, helper: string }) {

    const classes = useInputStyle();

    const hotkeys = useContext(HotkeyContext);

    return (
            <TextField label={label} InputProps={{
            endAdornment: <InputAdornment disableTypography={true} 
                                            position="end" 
                                            classes={{ positionEnd: classes.adorment }}>
                            {suffix}
                        </InputAdornment> }}

            inputProps={{ className: classes.input }}
            InputLabelProps={ { classes: { root: classes.label }} }
            value={value}
            onChange={(event) => onChange(event.target.value)}
            error={error}
            FormHelperTextProps={{ classes: { root: classes.helper } }}
            helperText={helper}
            onFocus={() => hotkeys.setEnabled(false)}
            onBlur={() => hotkeys.setEnabled(true)} />
    );
}

function FoodSpawnRate({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean }) {

    const foodSpawnRateString = useLanguageString("foodSpawnRate");

    const nonNegativeNumber = useLanguageString("nonNegativeNumber");

    return (
        <Input value={value} label={foodSpawnRateString} suffix="/ s" onChange={onChange} error={error} helper={nonNegativeNumber} />
    );
}

function FoodMaxAge({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean }) {

    const foodMaxAgeString = useLanguageString("foodMaxAge");

    const nonNegativeNumber = useLanguageString("nonNegativeNumber");

    return (
        <Input value={value} label={foodMaxAgeString} suffix="s" onChange={onChange} error={error} helper={nonNegativeNumber} />
    );
}

function InitialFood({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean }) {

    const initialFoodString = useLanguageString("initialFood");

    const nonNegativeNumber = useLanguageString("nonNegativeNumber");

    return (
        <Input value={value} label={initialFoodString} onChange={onChange} error={error} helper={nonNegativeNumber} />
    );
}

const horizontalFlexBox = Style.create({

    "& > *:not(:last-child)": {

        paddingRight: "15px"
    },

    alignItems: "flex-start"

}, {}, Style.horizontalFlexBox);

const verticalFlexBox = Style.create({

    "& > *:not(:last-child)": {

        paddingBottom: "15px"
    },

    alignItems: "flex-start"

}, {}, Style.verticalFlexBox);

const useEntityOptionsStyles = makeStyles(({ theme }) => ({

    container: verticalFlexBox.compose(theme)

}));

const useHorizontalFlexBox = makeStyles(({ theme }) => ({

    container: horizontalFlexBox.compose(theme)
    
}));

function EntityOptions({ type, state, setState }: { type: "predator" | "prey", state: ValidatedEntityOptions,
                                    setState: React.Dispatch<React.SetStateAction<ValidatedEntityOptions>> }) {

    const { container } = useEntityOptionsStyles(); 

    const initialCountString = useLanguageString("initialCount");
    const typeString = useLanguageString(type);
    const speedString = useLanguageString("speed");
    const maxForceAngleString = useLanguageString("maxForceAngle");
    const maxForceMagnitudeString = useLanguageString("maxForceMagnitude");
    const perceptionAngleString = useLanguageString("perceptionAngle");
    const perceptionRadiusString = useLanguageString("perceptionRadius");
    const alignmentModifierString = useLanguageString("alignmentModifier");
    const cohesionModifierString = useLanguageString("cohesionModifier");
    const separationModifierString = useLanguageString("separationModifier");
    const healthString = useLanguageString("health");
    const healthDeltaString = useLanguageString("healthDelta");
    const hungerString = useLanguageString("hunger");
    const hungerDecayString = useLanguageString("hungerDecay");
    const reproductionIntervalString = useLanguageString("reproductionInterval");
    const maxAgeString = useLanguageString("maxAge");
    const eatingThresholdString = useLanguageString("eatingThreshold");

    const nonNegativeNumber = useLanguageString("nonNegativeNumber");
    const nonNegativeFloat = useLanguageString("nonNegativeFloat");
    const numberInRange = useLanguageString("numberInRange");
    const numberInAngleRange = `${numberInRange}: 0-360`;

    return (
        <div className={container}>
            <div>{typeString}</div>

            <Input value={state.initialCount.value} 
                    label={initialCountString} 
                    onChange={(value) => setState({ ...state, initialCount: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.initialCount.valid} 
                    helper={nonNegativeNumber} />

            <Input value={state.speed.value} 
                    label={speedString} 
                    onChange={(value) => setState({ ...state, speed: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.speed.valid} 
                    helper={nonNegativeNumber} />

            <Input value={state.maxForceAngle.value} 
                    label={maxForceAngleString} 
                    onChange={(value) => setState({ ...state, maxForceAngle: { value, valid: numberRangeValidator(value, 0, 360) } })} 
                    error={!state.maxForceAngle.valid}
                    suffix="°"
                    helper={numberInAngleRange} />

            <Input value={state.maxForceMagnitude.value} 
                    label={maxForceMagnitudeString} 
                    onChange={(value) => setState({ ...state, maxForceMagnitude: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.maxForceMagnitude.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.perceptionAngle.value} 
                    label={perceptionAngleString} 
                    onChange={(value) => setState({ ...state, perceptionAngle: { value, valid: numberRangeValidator(value, 0, 360) } })} 
                    error={!state.perceptionAngle.valid}
                    suffix="°"
                    helper={numberInAngleRange} />

            <Input value={state.perceptionRadius.value} 
                    label={perceptionRadiusString} 
                    onChange={(value) => setState({ ...state, perceptionRadius: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.perceptionRadius.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.health.value} 
                    label={healthString} 
                    onChange={(value) => setState({ ...state, health: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.health.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.healthDelta.value} 
                    label={healthDeltaString} 
                    onChange={(value) => setState({ ...state, healthDelta: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.healthDelta.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.hunger.value} 
                    label={hungerString} 
                    onChange={(value) => setState({ ...state, hunger: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.hunger.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.hungerDecay.value} 
                    label={hungerDecayString} 
                    onChange={(value) => setState({ ...state, hungerDecay: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.hungerDecay.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.reproductionInterval.value} 
                    label={reproductionIntervalString} 
                    onChange={(value) => setState({ ...state, reproductionInterval: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.reproductionInterval.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.maxAge.value} 
                    label={maxAgeString} 
                    onChange={(value) => setState({ ...state, maxAge: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.maxAge.valid}
                    helper={nonNegativeNumber} />

            <Input value={state.eatingThreshold.value} 
                    label={eatingThresholdString} 
                    onChange={(value) => setState({ ...state, eatingThreshold: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.eatingThreshold.valid}
                    helper={nonNegativeNumber} />
            {
            type === "prey" ?
            <>
            <Input value={state.alignmentModifier.value} 
                label={alignmentModifierString} 
                onChange={(value) => setState({ ...state, alignmentModifier: { value, valid: positiveFloatValidator(value) } })} 
                error={!state.alignmentModifier.valid}
                helper={nonNegativeFloat} />

            <Input value={state.cohesionModifier.value} 
                label={cohesionModifierString} 
                onChange={(value) => setState({ ...state, cohesionModifier: { value, valid: positiveFloatValidator(value) } })} 
                error={!state.cohesionModifier.valid}
                helper={nonNegativeFloat} />

            <Input value={state.separationModifier.value} 
                label={separationModifierString} 
                onChange={(value) => setState({ ...state, separationModifier: { value, valid: positiveFloatValidator(value) } })} 
                error={!state.separationModifier.valid}
                helper={nonNegativeFloat} />

            </> : null
            }
        </div>
    );
}

function Entities({ predatorState, preyState, setPredatorState, setPreyState }: 
                        { predatorState: ValidatedEntityOptions, preyState: ValidatedEntityOptions,
                        setPredatorState: React.Dispatch<React.SetStateAction<ValidatedEntityOptions>>,
                        setPreyState: React.Dispatch<React.SetStateAction<ValidatedEntityOptions>> }) {

    const { container } = useHorizontalFlexBox(); 

    return (
        <div className={container}>
            <EntityOptions type="predator" state={predatorState} setState={setPredatorState} />
            <EntityOptions type="prey" state={preyState} setState={setPreyState} />
        </div>
    );
}

function setupStateToContextOptions(state: SetupState): undefined | ContextOptions {

    let valid = true;

    valid = state.foodSpawnRate.valid && valid;
    valid = state.foodMaxAge.valid && valid;
    valid = state.initialFood.valid && valid;

    if(!valid) return undefined;

    let type: "predators" | "preys";

    for(type of (["predators", "preys"] as const)) {

        const entity = state[type];

        let key: keyof ValidatedEntityOptions;

        for(key in entity) {

            const option = entity[key];

            if(!option.valid) return undefined;
        }
    }

    return {

        onBoundaryHit: "wrap",
        drawQuadtree: state.drawQuadTree,
        area: areas[state.area],

        foodSpawn: parseInt(state.foodSpawnRate.value),
        foodMaxAge: parseInt(state.foodMaxAge.value),
        initialFood: parseInt(state.initialFood.value),

        entities: {

            predator: {

                speed: parseInt(state.predators.speed.value),
                maxForce: {

                    magnitude: parseInt(state.predators.maxForceMagnitude.value),
                    angle: parseInt(state.predators.maxForceAngle.value)
                },

                perception: {

                    radius: parseInt(state.predators.perceptionRadius.value),
                    angle: parseInt(state.predators.perceptionAngle.value)
                },

                collisionRadius: 20,

                flockingModifier: {

                    alignment: 0,
                    cohesion: 0,
                    separation: 0
                },

                health: parseInt(state.predators.health.value),
                healthDelta: parseInt(state.predators.healthDelta.value),

                hunger: parseInt(state.predators.hunger.value),
                hungerDecay: parseInt(state.predators.hungerDecay.value),

                reproductionInterval: parseInt(state.predators.reproductionInterval.value),

                maxAge: parseInt(state.predators.maxAge.value),

                eatingThreshold: parseInt(state.predators.eatingThreshold.value),
            },

            prey: {

                speed: parseInt(state.preys.speed.value),
                maxForce: {

                    magnitude: parseInt(state.preys.maxForceMagnitude.value),
                    angle: parseInt(state.preys.maxForceAngle.value)
                },

                perception: {

                    radius: parseInt(state.preys.perceptionRadius.value),
                    angle: parseInt(state.preys.perceptionAngle.value)
                },

                collisionRadius: 20,

                flockingModifier: {

                    alignment: parseFloat(state.preys.alignmentModifier.value),
                    cohesion: parseFloat(state.preys.cohesionModifier.value),
                    separation: parseFloat(state.preys.separationModifier.value),
                },

                health: parseInt(state.preys.health.value),
                healthDelta: parseInt(state.preys.healthDelta.value),

                hunger: parseInt(state.preys.hunger.value),
                hungerDecay: parseInt(state.preys.hungerDecay.value),

                reproductionInterval: parseInt(state.preys.reproductionInterval.value),

                maxAge: parseInt(state.preys.maxAge.value),

                eatingThreshold: parseInt(state.preys.eatingThreshold.value),
            }
        }
    };
}

const areas: Array<Dimensions2D> = [
    { width: 500, height: 500 },
    { width: 2000, height: 2000 },
    { width: 5000, height: 5000 },
    { width: 10000, height: 10000 },
    { width: 20000, height: 20000 },
];

function Confirm({ state }: { state: SetupState }) {

    const dispatch = useDispatch();

    const entityContext = useContext(SimStateContext).entities.context.current;
    const statsContext = useContext(StatsStateContext);

    const { tooltip: tooltipClass } = useTooltipStyles();
    const { button: buttonClass } = useButtonStyles();

    const confirmString = useLanguageString("confirm");

    return <Tooltip title={confirmString} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: tooltipClass }}>
            <Button onClick={() => {

                const contextOptions = setupStateToContextOptions(state);

                if(contextOptions === undefined) return;

                const predatorCount = parseInt(state.predators.initialCount.value);
                const preyCount = parseInt(state.preys.initialCount.value);

                dispatch(setSimArea(areas[state.area]));

                statsContext.entities.array.current = [];
                statsContext.entities.predators.current = predatorCount;
                statsContext.entities.preys.current = preyCount;
                
                entityContext.init(predatorCount, preyCount, contextOptions);

                dispatch(centerCameraToArea());

            }} className={buttonClass}>
                {<DoneIcon />}
            </Button>
        </Tooltip>
}

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",
    zIndex: 1,

    marginTop: "-1px",

    fontSize: "18px",

    transform: (isOpen: boolean) => `translateX(${isOpen ? 0 : 100}%)`,

    transition: "transform .3s ease-in-out",

    borderStyle: "none",
    borderLeftStyle: "solid",

    padding: "15px 25px",

    overflowY: "auto",

    alignItems: "flex-start",

}, {}, [Style.panel, Style.textColor, verticalFlexBox]);

const usePanelStyles = makeStyles(({ theme }) => ({

    panel: panelStyle.compose(theme)

}));

type InputWithValidation = {

    valid: boolean;
    value: string;
};

function numberValidator(value: string): boolean {

    return new RegExp(/^[+-]?\d+$/).test(value);
}

function positiveNumberValidator(value: string): boolean {

    return new RegExp(/^\+?\d+$/).test(value);
}

function positiveFloatValidator(value: string): boolean {

    return new RegExp(/^\+?\d+(\.\d+)?$/).test(value);
}

function numberRangeValidator(value: string, lower: number, upper: number): boolean {

    if(!numberValidator(value)) return false;
    
    const num = parseInt(value);

    return num >= lower && num <= upper;
}

type ValidatedEntityOptions = {

    [key in     "initialCount"  
            |   "speed"
            |   "maxForceAngle"
            |   "maxForceMagnitude"
            |   "perceptionRadius"
            |   "perceptionAngle"
            |   "alignmentModifier"
            |   "cohesionModifier"
            |   "separationModifier"
            |   "hungerDecay"
            |   "healthDelta"
            |   "health"
            |   "hunger"
            |   "reproductionInterval"
            |   "maxAge"
            |   "eatingThreshold"]: InputWithValidation; 
};

type SetupState = {

    drawQuadTree: boolean;
    area: number;
    foodSpawnRate: InputWithValidation;
    foodMaxAge: InputWithValidation;
    initialFood: InputWithValidation;

    predators: ValidatedEntityOptions;
    preys: ValidatedEntityOptions;
}

export default function SimSetup() {

    const isOpen = useSelector((state: StateShape) => state.global.sidePanel) === "setup";

    const { panel } = usePanelStyles(isOpen);

    const [drawQuadTree, setDrawQuadTree] = useState(true);
    const [area, setArea] = useState(1);

    const [foodSpawnRate, setFoodSpawnRate] = useState<InputWithValidation>({ value: "0", valid: true });
    const [foodMaxAge, setFoodMaxAge] = useState<InputWithValidation>({ value: "0", valid: true });
    const [initialFood, setInitialFood] = useState<InputWithValidation>({ value: "0", valid: true });

    const [predatorState, setPredatorState] = useState<ValidatedEntityOptions>(
        {
            initialCount: {

                value: "0",
                valid: true
            },
            speed: {

                value: "0",
                valid: true
            },
            maxForceAngle: {

                value: "0",
                valid: true
            },
            maxForceMagnitude: {

                value: "0",
                valid: true
            },
            perceptionRadius: {

                value: "0",
                valid: true
            },
            perceptionAngle: {

                value: "0",
                valid: true
            },
            alignmentModifier: {

                value: "0",
                valid: true
            },
            cohesionModifier: {

                value: "0",
                valid: true
            },
            separationModifier: {

                value: "0",
                valid: true
            },
            hungerDecay: {

                value: "0",
                valid: true
            },
            healthDelta: {

                value: "0",
                valid: true
            },
            health: {

                value: "0",
                valid: true
            },
            hunger: {

                value: "0",
                valid: true
            },
            reproductionInterval: {

                value: "0",
                valid: true
            },
            maxAge: {

                value: "0",
                valid: true
            },
            eatingThreshold: {

                value: "0",
                valid: true
            }
        }
    );

    const [preyState, setPreyState] = useState<ValidatedEntityOptions>(
        {   
            initialCount: {

                value: "0",
                valid: true
            },
            speed: {

                value: "0",
                valid: true
            },
            maxForceAngle: {

                value: "0",
                valid: true
            },
            maxForceMagnitude: {

                value: "0",
                valid: true
            },
            perceptionRadius: {

                value: "0",
                valid: true
            },
            perceptionAngle: {

                value: "0",
                valid: true
            },
            alignmentModifier: {

                value: "0",
                valid: true
            },
            cohesionModifier: {

                value: "0",
                valid: true
            },
            separationModifier: {

                value: "0",
                valid: true
            },
            hungerDecay: {

                value: "0",
                valid: true
            },
            healthDelta: {

                value: "0",
                valid: true
            },
            health: {

                value: "0",
                valid: true
            },
            hunger: {

                value: "0",
                valid: true
            },
            reproductionInterval: {

                value: "0",
                valid: true
            },
            maxAge: {

                value: "0",
                valid: true
            },
            eatingThreshold: {

                value: "0",
                valid: true
            }
        }
    );

    return (

        <div className={panel}>
            
            <DrawQuadTree onChange={(checked) => setDrawQuadTree(checked)} checked={drawQuadTree} />
            <SelectArea onChange={(value) => setArea(value)} value={area} />

            <FoodSpawnRate value={foodSpawnRate.value} error={!foodSpawnRate.valid} onChange={(value) => 
                setFoodSpawnRate({ value, valid: positiveNumberValidator(value) })} />

            <FoodMaxAge value={foodMaxAge.value} error={!foodMaxAge.valid} onChange={(value) => 
                setFoodMaxAge({ value, valid: positiveNumberValidator(value) })} />

            <InitialFood value={initialFood.value} error={!initialFood.valid} onChange={(value) => 
                setInitialFood({ value, valid: positiveNumberValidator(value) })} />

            <Entities predatorState={predatorState} setPredatorState={setPredatorState} preyState={preyState} setPreyState={setPreyState} />
            
            <Confirm state={{
                
                drawQuadTree,
                area,
                foodSpawnRate,
                foodMaxAge,
                initialFood,
                predators: predatorState,
                preys: preyState
            }} /> 
        </div>
    );
}