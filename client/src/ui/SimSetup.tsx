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
import { openSidePanel } from "../state/slices/global";

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

// import templates
import { templates } from "../templates";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style } from "../stylers";

// import type information
import { StateShape } from "../types/redux";
import { Dimensions2D } from "../types/utils";
import { ContextOptions } from "../types/entity";
import { SetupState, ValidatedEntityOptions, InputWithValidation } from "../types/setup";

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

function TemplateSelector({ selected, onSelect }: { selected: number, onSelect: (value: number) => any }) {

    const classes = useSelectStyles();

    const templatesString = useLanguageString("templates");

    const templateNames = [

        "1",
        "2",
        "3"
    ];

    return (
        <div>
            <FormControl className={classes.formControl}>
            <InputLabel classes={{ root: classes.label }}>{templatesString}</InputLabel>
                <Select value={selected}
                        MenuProps={{ classes: { paper: classes.menu }}}
                        classes={{ root: classes.select, icon: classes.selectIcon }}>
                        {
                            templates.map((_, idx) => 
                        <MenuItem key={idx} value={idx} onClick={() => onSelect(idx)} classes={{ root: classes.item }}>{templateNames[idx]}</MenuItem>)
                        }
                </Select>
            </FormControl>
        </div>
    );
}

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
                    <MenuItem value={0} classes={{ root: classes.item }}>{`${verySmallString} ${areas[0].width} x ${areas[0].height}`}</MenuItem>
                    <MenuItem value={1} classes={{ root: classes.item }}>{`${smallString} ${areas[1].width} x ${areas[1].height}`}</MenuItem>
                    <MenuItem value={2} classes={{ root: classes.item }}>{`${mediumString} ${areas[2].width} x ${areas[2].height}`}</MenuItem>
                    <MenuItem value={3} classes={{ root: classes.item }}>{`${largeString} ${areas[3].width} x ${areas[3].height}`}</MenuItem>
                    <MenuItem value={4} classes={{ root: classes.item }}>{`${veryLargeString} ${areas[4].width} x ${areas[4].height}`}</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

const inputStyle = Style.create({

    maxWidth: "160px"

}, {}, Style.textColor);
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
            helperText={error ? helper : ""}
            onFocus={() => hotkeys.setEnabled(false)}
            onBlur={() => hotkeys.setEnabled(true)} />
    );
}

function FoodSpawnRate({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean }) {

    const foodSpawnRateString = useLanguageString("foodSpawnRate");

    const nonNegativeDecimal = useLanguageString("nonNegativeDecimal");

    return (
        <Input value={value} label={foodSpawnRateString} suffix="/ s" onChange={onChange} error={error} helper={nonNegativeDecimal} />
    );
}

function FoodMaxAge({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean }) {

    const foodMaxAgeString = useLanguageString("foodMaxAge");

    const nonNegativeDecimal = useLanguageString("nonNegativeDecimal");

    return (
        <Input value={value} label={foodMaxAgeString} suffix="s" onChange={onChange} error={error} helper={nonNegativeDecimal} />
    );
}

function InitialFood({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean }) {

    const initialFoodString = useLanguageString("initialFood");

    const nonNegativeNumber = useLanguageString("nonNegativeNumber");

    return (
        <Input value={value} label={initialFoodString} onChange={onChange} error={error} helper={nonNegativeNumber} />
    );
}

function RegenerateEntities({ onChange, checked }: { onChange: (checked: boolean) => any, checked: boolean }) {

    const { checkbox } = useCheckBoxStyles();

    const regenerateEntitiesString = useLanguageString("regenerateEntities");

    return (
        <div>
            {regenerateEntitiesString}: <Checkbox classes={{ root: checkbox }} 
                                        color="default"
                                        onChange={(_, checked) => onChange(checked)}
                                        checked={checked} />
        </div>);
}

function RegenerationInterval({ value, onChange, error }: { value: string, onChange: InputOnChange, error: boolean, }) {

    const regenerationIntervalString = useLanguageString("entityRegenInterval");

    const nonNegativeDecimal = useLanguageString("nonNegativeDecimal");

    return (
        <Input value={value} label={regenerationIntervalString} suffix="s" onChange={onChange} error={error} helper={nonNegativeDecimal} />
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
    const minimalCountString = useLanguageString("minEntityCount");
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
    const mutationModifierString = useLanguageString("mutationModifier");

    const nonNegativeNumber = useLanguageString("nonNegativeNumber");
    const nonNegativeDecimal = useLanguageString("nonNegativeDecimal");
    const decimalInRange = useLanguageString("decimalInRange");
    const decimalInAngleRange = `${decimalInRange}: 0-360`;
    const decimalInPercentRange = `${decimalInRange}: 0-100`;
    
    const unitsString = useLanguageString("units");                                   

    return (
        <div className={container}>
            <div>{typeString}</div>

            <Input value={state.minCount.value} 
                    label={minimalCountString} 
                    onChange={(value) => setState({ ...state, minCount: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.minCount.valid} 
                    helper={nonNegativeNumber} />

            <Input value={state.initialCount.value} 
                    label={initialCountString} 
                    onChange={(value) => setState({ ...state, initialCount: { value, valid: positiveNumberValidator(value) } })} 
                    error={!state.initialCount.valid} 
                    helper={nonNegativeNumber} />

            <Input value={state.speed.value} 
                    label={speedString} 
                    onChange={(value) => setState({ ...state, speed: { value, valid: positiveFloatValidator(value) } })} 
                    error={!state.speed.valid} 
                    suffix={`${unitsString} / s`}
                    helper={nonNegativeDecimal} />

            <Input value={state.maxForceAngle.value} 
                    label={maxForceAngleString} 
                    onChange={(value) => setState({ ...state, maxForceAngle: { value, valid: floatRangeValidator(value, 0, 360) } })} 
                    error={!state.maxForceAngle.valid}
                    suffix="°"
                    helper={decimalInAngleRange} />

            <Input value={state.maxForceMagnitude.value} 
                    label={maxForceMagnitudeString} 
                    onChange={(value) => setState({ ...state, maxForceMagnitude: { value, valid: positiveFloatValidator(value) } })} 
                    error={!state.maxForceMagnitude.valid}
                    suffix={unitsString}
                    helper={nonNegativeDecimal} />

            <Input value={state.perceptionAngle.value} 
                    label={perceptionAngleString} 
                    onChange={(value) => setState({ ...state, perceptionAngle: { value, valid: floatRangeValidator(value, 0, 360) } })} 
                    error={!state.perceptionAngle.valid}
                    suffix="°"
                    helper={decimalInAngleRange} />

            <Input value={state.perceptionRadius.value} 
                    label={perceptionRadiusString} 
                    onChange={(value) => setState({ ...state, perceptionRadius: { value, valid: positiveFloatValidator(value) } })} 
                    error={!state.perceptionRadius.valid}
                    suffix={unitsString}
                    helper={nonNegativeDecimal} />

            <Input value={state.health.value} 
                    label={healthString} 
                    onChange={(value) => setState({ ...state, health: { value, valid: floatRangeValidator(value, 0, 100) } })} 
                    error={!state.health.valid}
                    suffix="%"
                    helper={decimalInPercentRange} />

            <Input value={state.healthDelta.value} 
                    label={healthDeltaString} 
                    onChange={(value) => setState({ ...state, healthDelta: { value, valid: floatRangeValidator(value, 0, 100) } })} 
                    error={!state.healthDelta.valid}
                    suffix="%"
                    helper={decimalInPercentRange} />

            <Input value={state.hunger.value} 
                    label={hungerString} 
                    onChange={(value) => setState({ ...state, hunger: { value, valid: floatRangeValidator(value, 0, 100) } })} 
                    error={!state.hunger.valid}
                    suffix="%"
                    helper={decimalInPercentRange} />

            <Input value={state.hungerDecay.value} 
                    label={hungerDecayString} 
                    onChange={(value) => setState({ ...state, hungerDecay: { value, valid: floatRangeValidator(value, 0, 100) } })} 
                    error={!state.hungerDecay.valid}
                    suffix="%"
                    helper={decimalInPercentRange} />

            <Input value={state.eatingThreshold.value} 
                    label={eatingThresholdString} 
                    onChange={(value) => setState({ ...state, eatingThreshold: { value, valid: floatRangeValidator(value, 0, 100) } })} 
                    error={!state.eatingThreshold.valid}
                    suffix="%"
                    helper={decimalInPercentRange} />

            <Input value={state.reproductionInterval.value} 
                    label={reproductionIntervalString} 
                    onChange={(value) => setState({ ...state, reproductionInterval: { value, valid: positiveFloatValidator(value) } })} 
                    error={!state.reproductionInterval.valid}
                    suffix="s"
                    helper={nonNegativeDecimal} />

            <Input value={state.maxAge.value} 
                    label={maxAgeString} 
                    onChange={(value) => setState({ ...state, maxAge: { value, valid: positiveFloatValidator(value) } })} 
                    error={!state.maxAge.valid}
                    suffix="s"
                    helper={nonNegativeDecimal} />

            <Input value={state.mutationModifier.value} 
                    label={mutationModifierString} 
                    onChange={(value) => setState({ ...state, mutationModifier: { value, valid: positiveFloatValidator(value) } })} 
                    error={!state.mutationModifier.valid}
                    helper={nonNegativeDecimal} />
            {
            type === "prey" ?
            <>
            <Input value={state.alignmentModifier.value} 
                label={alignmentModifierString} 
                onChange={(value) => setState({ ...state, alignmentModifier: { value, valid: positiveFloatValidator(value) } })} 
                error={!state.alignmentModifier.valid}
                helper={nonNegativeDecimal} />

            <Input value={state.cohesionModifier.value} 
                label={cohesionModifierString} 
                onChange={(value) => setState({ ...state, cohesionModifier: { value, valid: positiveFloatValidator(value) } })} 
                error={!state.cohesionModifier.valid}
                helper={nonNegativeDecimal} />

            <Input value={state.separationModifier.value} 
                label={separationModifierString} 
                onChange={(value) => setState({ ...state, separationModifier: { value, valid: positiveFloatValidator(value) } })} 
                error={!state.separationModifier.valid}
                helper={nonNegativeDecimal} />

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
    valid = state.regenerationInterval.valid && valid;

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
        
        drawQuadtree: state.drawQuadTree,
        area: areas[state.area],

        foodSpawn: parseFloat(state.foodSpawnRate.value),
        foodMaxAge: parseFloat(state.foodMaxAge.value),
        initialFood: parseInt(state.initialFood.value),

        regenerate: state.regenerateEntities,
        regenerationInterval: parseFloat(state.regenerationInterval.value),

        minEntities: {

            predator: parseInt(state.predators.minCount.value),
            prey: parseInt(state.preys.minCount.value)
        },

        entities: {

            predator: {

                speed: parseFloat(state.predators.speed.value),
                maxForce: {

                    magnitude: parseFloat(state.predators.maxForceMagnitude.value),
                    angle: parseFloat(state.predators.maxForceAngle.value)
                },

                perception: {

                    radius: parseFloat(state.predators.perceptionRadius.value),
                    angle: parseFloat(state.predators.perceptionAngle.value)
                },

                collisionRadius: 20,

                flockingModifier: {

                    alignment: 0,
                    cohesion: 0,
                    separation: 0
                },

                health: parseFloat(state.predators.health.value),
                healthDelta: parseFloat(state.predators.healthDelta.value),

                hunger: parseFloat(state.predators.hunger.value),
                hungerDecay: parseFloat(state.predators.hungerDecay.value),

                reproductionInterval: parseFloat(state.predators.reproductionInterval.value),

                maxAge: parseFloat(state.predators.maxAge.value),

                eatingThreshold: parseFloat(state.predators.eatingThreshold.value),

                mutationModifier: parseFloat(state.predators.mutationModifier.value),

                generation: 1
            },

            prey: {

                speed: parseFloat(state.preys.speed.value),
                maxForce: {

                    magnitude: parseFloat(state.preys.maxForceMagnitude.value),
                    angle: parseFloat(state.preys.maxForceAngle.value)
                },

                perception: {

                    radius: parseFloat(state.preys.perceptionRadius.value),
                    angle: parseFloat(state.preys.perceptionAngle.value)
                },

                collisionRadius: 20,

                flockingModifier: {

                    alignment: parseFloat(state.preys.alignmentModifier.value),
                    cohesion: parseFloat(state.preys.cohesionModifier.value),
                    separation: parseFloat(state.preys.separationModifier.value),
                },

                health: parseFloat(state.preys.health.value),
                healthDelta: parseFloat(state.preys.healthDelta.value),

                hunger: parseFloat(state.preys.hunger.value),
                hungerDecay: parseFloat(state.preys.hungerDecay.value),

                reproductionInterval: parseFloat(state.preys.reproductionInterval.value),

                maxAge: parseFloat(state.preys.maxAge.value),

                eatingThreshold: parseFloat(state.preys.eatingThreshold.value),

                mutationModifier: parseFloat(state.preys.mutationModifier.value),

                generation: 1
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

    const simState = useContext(SimStateContext);
    const entityContext = simState.entities.context.current;
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

                simState.time.elapsed.current = 0;
                
                statsContext.entities.clearStats();
                
                entityContext.clearSelectedEntity();
                entityContext.init(predatorCount, preyCount, contextOptions);                
                
                dispatch(setSimArea(areas[state.area]));
                dispatch(centerCameraToArea());
                dispatch(openSidePanel("stats"));

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

function numberValidator(value: string): boolean {

    return new RegExp(/^[+-]?\d+$/).test(value);
}

function numberRangeValidator(value: string, lower: number, upper: number): boolean {

    if(!numberValidator(value)) return false;
    
    const num = parseInt(value);

    return num >= lower && num <= upper;
}

function positiveNumberValidator(value: string): boolean {

    return numberRangeValidator(value, 0, Infinity);
}

function floatValidator(value: string): boolean {

    return new RegExp(/^[+-]?\d+(\.\d+)?$/).test(value);
}

function floatRangeValidator(value: string, lower: number, upper: number): boolean {

    if(!floatValidator(value)) return false;
    
    const num = parseFloat(value);

    return num >= lower && num <= upper;
}

function positiveFloatValidator(value: string): boolean {

    return floatRangeValidator(value, 0, Infinity);
}

export default function SimSetup() {

    const isOpen = useSelector((state: StateShape) => state.global.sidePanel) === "setup";

    const { panel } = usePanelStyles(isOpen);

    const [template, setTemplate] = useState(0);

    const [drawQuadTree, setDrawQuadTree] = useState(templates[template].drawQuadTree);
    const [area, setArea] = useState(templates[template].area);

    const [foodSpawnRate, setFoodSpawnRate] = useState<InputWithValidation>(templates[template].foodSpawnRate);
    const [foodMaxAge, setFoodMaxAge] = useState<InputWithValidation>(templates[template].foodMaxAge);
    const [initialFood, setInitialFood] = useState<InputWithValidation>(templates[template].initialFood);

    const [regenerateEntities, setRegenerateEntities] = useState(templates[template].regenerateEntities);

    const [regenerationInterval, setRegenerationInterval] = useState(templates[template].regenerationInterval);

    const [predatorState, setPredatorState] = useState<ValidatedEntityOptions>(templates[template].predators);

    const [preyState, setPreyState] = useState<ValidatedEntityOptions>(templates[template].preys);

    const onTemplateSelect = (selected: number) => {

        setTemplate(selected);

        const current = templates[selected];

        setDrawQuadTree(current.drawQuadTree);
        setArea(current.area);
        setFoodSpawnRate(current.foodSpawnRate);
        setFoodMaxAge(current.foodMaxAge);
        setInitialFood(current.initialFood);
        setRegenerateEntities(current.regenerateEntities);
        setRegenerationInterval(current.regenerationInterval);

        setPredatorState(current.predators);
        setPreyState(current.preys);
    };

    return (

        <div className={panel}>
            
            <TemplateSelector selected={template} onSelect={onTemplateSelect} />
            <DrawQuadTree onChange={(checked) => setDrawQuadTree(checked)} checked={drawQuadTree} />
            <SelectArea onChange={(value) => setArea(value)} value={area} />

            <FoodSpawnRate value={foodSpawnRate.value} error={!foodSpawnRate.valid} onChange={(value) => 
                setFoodSpawnRate({ value, valid: positiveFloatValidator(value) })} />

            <FoodMaxAge value={foodMaxAge.value} error={!foodMaxAge.valid} onChange={(value) => 
                setFoodMaxAge({ value, valid: positiveFloatValidator(value) })} />

            <InitialFood value={initialFood.value} error={!initialFood.valid} onChange={(value) => 
                setInitialFood({ value, valid: positiveNumberValidator(value) })} />

            <RegenerateEntities onChange={(checked) => setRegenerateEntities(checked)} checked={regenerateEntities} />

            <RegenerationInterval value={regenerationInterval.value} error={!regenerationInterval.valid} onChange={(value) => 
                setRegenerationInterval({ value, valid: positiveFloatValidator(value) })}/>

            <Entities predatorState={predatorState} setPredatorState={setPredatorState} preyState={preyState} setPreyState={setPreyState} />
            
            <Confirm state={{
                
                drawQuadTree,
                area,
                foodSpawnRate,
                foodMaxAge,
                initialFood,
                regenerateEntities,
                regenerationInterval,
                predators: predatorState,
                preys: preyState
            }} /> 
        </div>
    );
}