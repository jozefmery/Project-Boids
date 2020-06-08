/**
 * File: types/setup.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.4.2020
 * License: none
 * Description: Defines types for the simulation setup component.
 * 
 */

export type InputWithValidation = {

    valid: boolean;
    value: string;
};

export type ValidatedEntityOptions = {

    [key in     "initialCount"
            |   "minCount"
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
            |   "eatingThreshold"
            |   "mutationModifier"]: InputWithValidation; 
};

export type SetupState = {

    drawQuadTree: boolean;
    area: number;
    foodSpawnRate: InputWithValidation;
    foodMaxAge: InputWithValidation;
    initialFood: InputWithValidation;

    regenerateEntities: boolean;
    regenerationInterval: InputWithValidation;

    predators: ValidatedEntityOptions;
    preys: ValidatedEntityOptions;
};