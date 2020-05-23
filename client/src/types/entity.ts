/**
 * File: types/entity.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 23.5.2020
 * License: none
 * Description: Defines various entity helper types.
 * 
 */


// import type information
import P5 from "p5";
import { RemoveUndefinedDeep, Dimensions2D } from "./utils";
import { Styler } from "./stylers";

export class Vector extends P5.Vector {};

export type EntityOptions = {

    speed?: number;
    maxForce?: {

        magnitude?: number;
        angle?: number;
    };

    perception?: {

        radius?: number;
        angle?: number;
    };

    collisionRadius?: number;

    flockingModifier?: {

        alignment?: number;
        cohesion?: number;
        separation?: number;
    }

    health?: number;
    healthDelta?: number;
    
    hunger?: number;
    hungerDecay?: number;

    reproductionInterval?: number;

    maxAge?: number;

    eatingThreshold?: number;
};

export type EntityCtorOptions = {

    options: RemoveUndefinedDeep<EntityOptions>;
    forces: EntityForces;
}

export type EntityStylers = {

    entity: Styler;
    perception: Styler;
    percieved: Styler;
    quadtree: Styler;
}

export type EntityForces = {

    position: Vector;
    velocity: Vector;
    acceleration: Vector;
};

export type EntityType = "predator" | "prey" | "food";

export type SelectableEntity = "predator" | "prey";

export type EntityGeneration = {

    [type in SelectableEntity]: RemoveUndefinedDeep<EntityOptions>;
};

export type ContextOptions = {

    onBoundaryHit: "wrap" | "kill";
    drawQuadtree: boolean;
    area: Dimensions2D;

    entities: EntityGeneration;

    foodSpawn: number;
    foodMaxAge: number;
    initialFood: number;
}