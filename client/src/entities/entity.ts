/**
 * File: entities/entity.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 24.4.2020
 * License: none
 * Description: 
 * 
 */

// TODO description

// import utilities
import lodash from "lodash";
import uniqid from "uniqid";
import { quadtree, Quadtree, QuadtreeLeaf } from "@dodmeister/quadtree";

// import p5
import P5 from "p5";

// import type information
import { Dimensions2D, Class, RemoveUndefinedDeep } from "../types/utils";

class Vector extends P5.Vector {};

function createVector(v1: number | Vector = 0, v2: number = 0, v3: number = 0): Vector {

    const vector = new Vector();

    if(v1 instanceof Vector) {

        vector.set(v1);
    
    } else {

        vector.set(v1, v2, v3);
    }

    return vector;
}

type EntityOptions = {

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

    hungerDecay?: number;
    healthDelta?: number;

    health?: number;
    hunger?: number;
};

type EntityCtorOptions = {

    options: RemoveUndefinedDeep<EntityOptions>;
    forces: EntityForces;
}

type Styler = (p5: P5) => void;

type EntityStyler = {

    entity: Styler;
    highlight: Styler;
    perception: Styler;
    percieved: Styler;
}

type EntityStylers = {

    prey: {

        default: Styler;
        highlight: Styler;
    };
    predator: {

        default: Styler;
        highlight: Styler;
    };
    food: Styler;
    perception: Styler;
    percieved: Styler;
    quadtree: Styler;
};

type Vicinity = Array<{ instance: Entity, dist: number }>;

type EntityForces = {

    position: Vector;
    velocity: Vector;
    acceleration: Vector;
};

export type EntityType = "predator" | "prey" | "food";

export type SelectableEntity = "predator" | "prey";

export class Entity {

    /// Protected members

    protected readonly type_: EntityType;
 
    protected readonly id_: string;

    protected options_: RemoveUndefinedDeep<EntityOptions>;

    protected forces_: EntityForces;

    protected draft_: {

        forces_: EntityForces;
    };

    protected vicinity_: Vicinity;

    protected percieved_: Vicinity;

    /// Constructor function
    
    protected constructor(options: EntityCtorOptions, type: EntityType) {

        this.type_ = type;
        this.id_ = uniqid();

        this.options_ = lodash.cloneDeep(options.options);

        this.forces_ = lodash.cloneDeep(options.forces);

        this.draft_ = {

            forces_: lodash.cloneDeep(this.forces_)
        };

        this.vicinity_ = [];

        this.percieved_ = [];
    }

    /// Protected methods

    protected isOutsideBoundary(area: Readonly<Dimensions2D>): boolean {

        // shorthands
        const { x, y } = this.draft().forces_.position;

        if(x < 0 || x > area.width || y < 0 || y > area.height) {

            return true;
        }

        return false;
    }

    protected wrap(area: Readonly<Dimensions2D>): Entity {
        
        // shorthands
        const { width, height } = area;
        const { position } = this.draft().forces_;

        if(position.x > width) {

            position.x = 0;
        }

        if(position.x < 0) {

            position.x = width;
        }

        if(position.y > height) {

            position.y = 0;
        }

        if(position.y < 0) {

            position.y = height;
        }

        return this;
    }

    protected collide(context: Context): Entity {

        const { onBoundaryHit } = context.options();
        const area = context.area();

        if(this.isOutsideBoundary(area)) {

            switch(onBoundaryHit) {

                case "kill": 

                    this.kill();
                    break;

                case "wrap":

                    this.wrap(area);
                    break;
            }
        }

        return this;
    }

    protected adjustSpeed(): Entity {

        // shorthands
        const { acceleration, velocity } = this.draft().forces_;

        // accelerate forward 
        const speedAdjustment = createVector(velocity);

        speedAdjustment.setMag(this.options_.speed - velocity.mag());
        
        // safety check
        if(acceleration.magSq() && speedAdjustment.magSq()) {

            const factor = 1 - (Math.abs(speedAdjustment.angleBetween(acceleration)) / Math.PI);

            speedAdjustment.mult(factor);
        }
        
        acceleration.add(speedAdjustment);

        return this;
    }

    protected limitAcceleration(): Entity {

        // shorthands
        const { velocity, acceleration } = this.draft().forces_;

        if(acceleration.magSq() === 0) return this;

        const angle = velocity.angleBetween(acceleration);

        const diff = Math.abs(angle) - this.options_.maxForce.angle;

        if(Math.sign(diff) === 1) {

            acceleration.rotate(-Math.sign(angle) * diff);
        }
        
        return this;
    }

    protected clearAcceleration(): Entity {

        // shorthands
        const { acceleration } = this.draft().forces_;

        acceleration.mult(0);

        return this;
    }

    protected updateVectors(timeDelta: number): Entity {

        // shorthands
        const { position, velocity, acceleration } = this.draft().forces_;

        this.limitAcceleration();
        
        this.adjustSpeed();

        velocity.add(Vector.mult(acceleration, timeDelta / 1000));
        position.add(Vector.mult(velocity, timeDelta / 1000));

        return this;
    }

    protected updateHealth(timeDelta: number): Entity {

        const hunger = this.options_.hunger;

        let modifier = 0;

        if(hunger === 0) {

            modifier = -1;
        
        } else if(hunger=== 100) {

            modifier = 1;
        }

        const delta = this.options_.healthDelta * (timeDelta / 1000) * modifier;

        this.options_.health = lodash.clamp(this.options_.health + delta, 0, 100);

        return this;
    }

    protected updateHunger(timeDelta: number): Entity {

        const delta = this.options_.hungerDecay * (timeDelta / 1000);
        this.options_.hunger = Math.max(0, this.options_.hunger - delta);

        return this;
    }

    protected vicinity(context: Context): Entity {

        // shorthands
        const { position, velocity } = this.draft().forces_;

        const { angle, radius: perceptionRadius } = this.options_.perception;
        
        // always have a minimal radius for collision
        const vicinityRadius = Math.max(perceptionRadius, this.options_.collisionRadius);

        this.vicinity_ = context.entities().findAll(position.x, position.y, vicinityRadius).map(instance => 
            
            ({ instance, dist: position.dist(instance.position()) }))
            
            .filter(pair => {

            if(pair.instance === this) return false;

            return pair.dist <= vicinityRadius;
        });

        this.percieved_ = this.vicinity_.filter(pair => {

            const angleBetween = velocity.angleBetween(Vector.sub(pair.instance.position(), position)) * (180 / Math.PI);

            return pair.dist <= perceptionRadius && Math.abs(angleBetween) <= angle / 2;
        });

        return this;
    }

    protected getPercievedType(type: EntityType): Vicinity {

        return this.percieved_.filter(entity => entity.instance.type() === type);
    }

    protected drawEntity(p5: P5, stylers: EntityStyler, highlighted: boolean): Entity {

        // shorthands
        const { position, velocity } = this.forces();

        p5.push();
        
        if(highlighted) {

            stylers.highlight(p5);
        
        } else {

            stylers.entity(p5);
        }

        p5.translate(position.x, position.y);
        p5.rotate(velocity.heading());
        
        p5.triangle(15, 0, -10, 10, -10, -10);
        
        p5.pop();

        return this;
    }

    protected drawPerception(p5: P5, stylers: EntityStyler, highlighted: boolean): Entity {
        
        if(!highlighted) return this;

        // shorthands
        const { radius, angle } = this.options_.perception;
        const { position, velocity } = this.forces();

        p5.push();

        stylers.perception(p5);

        p5.ellipseMode("radius");

        p5.translate(position.x, position.y);
        p5.rotate(velocity.heading());
        
        p5.arc(0, 0, radius, radius, p5.radians(- angle / 2), p5.radians(angle / 2), "pie");

        p5.pop();

        return this;
    }

    protected drawPercieved(p5: P5, stylers: EntityStyler, highlighted: boolean): Entity {      

        if(!highlighted) return this;

        // shorthands
        const { position } = this.forces();

        stylers.percieved(p5);

        for(const other of this.percieved_) {
            
            const otherPosition = other.instance.position();
        
            p5.line(position.x, position.y, otherPosition.x, otherPosition.y);
        }

        return this;
    }

    protected draft(): Entity["draft_"] {

        return this.draft_;
    }

    /// Public methods

    // mutator methods

    public kill(): Entity {

        this.options_.health = 0;
        
        return this;
    }

    // query methods

    public isAlive(): boolean {

        return this.options_.health > 0;
    }

    public health(): number {

        return this.options_.health;
    }

    public hunger(): number {

        return this.options_.hunger;
    }

    public type(): EntityType {

        return this.type_;
    }

    public id(): string {

        return this.id_;
    }

    public options(): Readonly<RemoveUndefinedDeep<EntityOptions>> {

        return this.options_;
    }

    public forces(): Readonly<EntityForces> {

        return this.forces_;
    }

    public position(): Readonly<Vector> {

        return this.forces_.position;
    }

    public velocity(): Readonly<Vector> {

        return this.forces_.velocity;
    }

    public acceleration(): Readonly<Vector> {

        return this.forces_.acceleration;
    }

    // update methods

    public update(timeDelta: number, context: Context): Entity {

        return this;
    }

    public draw(p5: P5, stylers: EntityStyler, highlighted: boolean = false): Entity {

        return this;
    }

    public applyDraft(): Entity {

        let draftProperty: keyof Entity["draft_"];

        for(draftProperty in this.draft_) {

            this[draftProperty] = lodash.cloneDeep(this.draft_[draftProperty]) as any;
        }

        return this;
    }
};

class Prey extends Entity {

    /// Constructor function

    public constructor(options: EntityCtorOptions) {

        super(options, "prey");
    }

    /// Protected methods

    protected getAlignment(percieved: Vicinity): Vector {

        // shorthands
        const { velocity } = this.draft().forces_;

        const alignment = createVector();

        for(const other of percieved) {
            
            alignment.add(other.instance.velocity());
        }

        if(percieved.length) {

            alignment.div(percieved.length);
            alignment.setMag(this.options_.speed);
            alignment.sub(velocity);
            alignment.limit(this.options_.maxForce.magnitude);
        }

        return alignment.mult(this.options_.flockingModifier.alignment);
    }

    protected getCohesion(percieved: Vicinity): Vector {

        // shorthands
        const { position, velocity } = this.draft().forces_;

        const coherence = createVector();

        for(const other of percieved) {
            
            coherence.add(other.instance.position());
        }

        if(percieved.length) {

            coherence.div(percieved.length);
            coherence.sub(position);
            coherence.setMag(this.options_.speed);
            coherence.sub(velocity);
            coherence.limit(this.options_.maxForce.magnitude);
        }

        return coherence.mult(this.options_.flockingModifier.cohesion);
    }

    protected getSeparation(percieved: Vicinity): Vector {

        // shorthands
        const { position, velocity } = this.draft().forces_;

        const separation = createVector();

        for(const other of percieved) {
            
            const diff = Vector.sub(position, other.instance.position());

            if(diff.magSq()) {

                diff.div(other.dist * other.dist);
                separation.add(diff);
            }
        }

        if(percieved.length) {

            separation.div(percieved.length);
            separation.setMag(this.options_.speed);
            separation.sub(velocity);
            separation.limit(this.options_.maxForce.magnitude);
        }

        return separation.mult(this.options_.flockingModifier.separation);
    }

    protected flock(): Prey {

        const { acceleration } = this.draft().forces_;

        const preys = this.getPercievedType("prey");
        
        acceleration.add(this.getAlignment(preys)); 
        acceleration.add(this.getCohesion(preys)); 
        acceleration.add(this.getSeparation(preys));

        return this;
    }

    /// Public methods

    public update(timeDelta: number, context: Context): Prey {

        this.clearAcceleration();

        this.vicinity(context);

        this.flock();

        this.updateVectors(timeDelta);

        this.collide(context);

        this.updateHunger(timeDelta);

        this.updateHealth(timeDelta);

        return this;
    }

    public draw(p5: P5, stylers: EntityStyler, highlighted: boolean = false): Prey {

        this.drawPerception(p5, stylers, highlighted);
        this.drawEntity(p5, stylers, highlighted);
        this.drawPercieved(p5, stylers, highlighted);

        return this;
    }
};

class Predator extends Entity {

    /// Constructor function

    public constructor(options: EntityCtorOptions) {

        super(options, "predator");
    }

    /// Protected methods 

    protected collide(context: Context): Predator {

        super.collide(context);

        return this;
    }

    /// Public methods

    public update(timeDelta: number, context: Context): Predator {

        this.clearAcceleration();

        this.vicinity(context);

        // TODO chase 

        this.updateVectors(timeDelta);

        this.collide(context);

        this.updateHunger(timeDelta);

        this.updateHealth(timeDelta);

        return this;
    }

    public draw(p5: P5, stylers: EntityStyler, highlighted: boolean = false): Predator {

        this.drawPerception(p5, stylers, highlighted);
        this.drawEntity(p5, stylers, highlighted);
        this.drawPercieved(p5, stylers, highlighted);

        return this;
    }
};

class Food extends Entity {
    
    /// Constructor function

    public constructor(options: EntityCtorOptions) {

        super(options, "food");
    }

    /// Protected methods

    protected drawEntity(p5: P5, stylers: EntityStyler): Food {

        const { position } = this.forces();

        stylers.entity(p5);
        p5.point(position.x, position.y);

        return this;
    }

    /// Public methods

    public update(timeDelta: number, context: Context): Food {

        // TODO health decay ?

        return this;
    }

    public draw(p5: P5, stylers: EntityStyler, _: boolean = false): Food {

        return this.drawEntity(p5, stylers);
    }
}

type EntityGeneration = {

    [type in SelectableEntity]: {

        base: RemoveUndefinedDeep<EntityOptions>;
        variation: RemoveUndefinedDeep<EntityOptions>;
    }
};

type ContextOptions = {

    onBoundaryHit: "wrap" | "kill";
    drawQuadtree: boolean;
    area: Dimensions2D;

    entities: EntityGeneration;

    foodSpawn: number;
}

export class Context {

    /// Protected members

    protected entities_: Quadtree<Entity>;

    protected options_: ContextOptions;

    protected selectedEntity_: Predator | Prey | undefined;

    protected counts_: {

        [type in EntityType]: number;
    };

    /// Contructor function

    constructor() {
        
        this.options_ = {

            onBoundaryHit: "kill",
            drawQuadtree: false,
            area: { width: 0, height: 0 },

            entities: {

                predator: {

                    base: {
                        
                        speed: 100,
                        maxForce: {

                            magnitude: 30,
                            angle: (2 / 3) * Math.PI
                        },

                        perception: {

                            radius: 300,
                            angle: 200
                        },

                        collisionRadius: 20,

                        flockingModifier: {

                            alignment: 1.0,
                            cohesion: 1.0,
                            separation: 1.0
                        },

                        hungerDecay: 5,
                        healthDelta: 20,

                        health: 100,
                        hunger: 100
                    },
                    
                    variation: {

                        speed: 10,
                        maxForce: {

                            magnitude: 3,
                            angle: (1 / 8) * Math.PI
                        },

                        perception: {

                            radius: 20,
                            angle: 10
                        },

                        collisionRadius: 0,

                        flockingModifier: {

                            alignment: 0.1,
                            cohesion: 0.1,
                            separation: 0.1
                        },

                        hungerDecay: 1,
                        healthDelta: 3,

                        health: 0,
                        hunger: 0
                    }
                },

                prey: {

                    base: {

                        speed: 100,
                        maxForce: {

                            magnitude: 30,
                            angle: (2 / 3) * Math.PI
                        },

                        perception: {

                            radius: 300,
                            angle: 200
                        },

                        collisionRadius: 20,

                        flockingModifier: {

                            alignment: 1.0,
                            cohesion: 1.0,
                            separation: 1.0
                        },

                        hungerDecay: 5,
                        healthDelta: 20,

                        health: 100,
                        hunger: 100
                    },
                    
                    variation: {

                        speed: 10,
                        maxForce: {

                            magnitude: 3,
                            angle: (1 / 8) * Math.PI
                        },

                        perception: {

                            radius: 20,
                            angle: 10
                        },

                        collisionRadius: 0,

                        flockingModifier: {

                            alignment: 0.1,
                            cohesion: 0.1,
                            separation: 0.1
                        },

                        hungerDecay: 1,
                        healthDelta: 3,

                        health: 0,
                        hunger: 0
                    }
                }
            },

            foodSpawn: 5
        };

        this.entities_ = this.createQuadTree();

        this.selectedEntity_ = undefined;

        this.counts_ = {

            predator: 0,
            prey: 0,
            food: 0
        };
    }

    /// Protected static methods

    protected static typeToConstructor(type: SelectableEntity): Class<Entity> {

        switch(type) {

            case "prey": return Prey;
            case "predator": return Predator;
        }
    }

    /// Protected methods

    protected getEntityCtorOptions(type: SelectableEntity): EntityCtorOptions {

        const options = this.options_.entities[type].base;

        const { width, height } = this.options_.area;
        const forces: EntityForces = {

            position: createVector(width * Math.random(), height * Math.random()),
            velocity: P5.Vector.random2D(),
            acceleration: createVector()
        };

        return {

            options,
            forces
        }
    }

    protected createQuadTree(): Quadtree<Entity> {

        return quadtree<Entity>()
            .x(entity => entity.position().x)
            .y(entity => entity.position().y)
            .cover(this.options_.area.width, this.options_.area.height);
    }

    protected drawQuadtree(p5: P5): Context {

        if(!this.options_.drawQuadtree) return this;
        
        p5.rectMode("corners");

        this.entities_.visit((_, x0, y0, x1, y1) => {

            p5.rect(x0, y0, x1, y1);
        });

        return this;
    }

    protected resetCounters(): Context {

        let type: EntityType;

        for(type in this.counts_) {

            this.counts_[type] = 0;
        }

        return this;
    }

    protected getEntityStylers(stylers: EntityStylers): { [type in EntityType]: EntityStyler } {

        return {

            predator: {

                entity: stylers.predator.default,
                highlight: stylers.predator.highlight,
                perception: stylers.perception,
                percieved: stylers.percieved
            },

            prey: {

                entity: stylers.prey.default,
                highlight: stylers.prey.highlight,
                perception: stylers.perception,
                percieved: stylers.percieved
            },

            food: {

                entity: stylers.food,
                highlight: () => undefined,
                perception: () => undefined,
                percieved: () => undefined,
            },
        }
    }

    protected addEntities(type: SelectableEntity, count: number): Context {

        for(let i = 0; i < count; ++i) {

            const options = this.getEntityCtorOptions(type)
            this.entities_.add(new (Context.typeToConstructor(type))(options));
        }

        return this;
    }

    protected spawnFood(timeDelta: number): Context {

        // TODO spawn food

        return this;
    }

    /// Public methods

    protected forEach(callback: (entity: Entity) => any): Context {

        this.entities_.visit(node => {

            if(node.length === undefined) {

                const entity = (node as QuadtreeLeaf<Entity>).data;

                callback(entity);
            }
        });

        return this;
    }

    // update methods

    public update(timeDelta: number): Context {

        this.spawnFood(timeDelta);

        this.forEach(entity => entity.update(timeDelta, this));
        this.forEach(entity => entity.applyDraft());

        const newTree = this.createQuadTree();

        this.resetCounters();
        
        this.forEach((entity) => { 
            
            if(entity.isAlive()) {

                newTree.add(entity);

                (this.counts_[entity.type()])++;
            
            } else if(entity === this.selectedEntity_) {

                this.clearSelectedEntity();
            }
        });

        this.entities_ = newTree;

        return this;
    }

    public draw(p5: P5, stylers: EntityStylers): Context {

        stylers.quadtree(p5);
        this.drawQuadtree(p5);

        const entityStylers = this.getEntityStylers(stylers);

        this.forEach(entity => entity.draw(p5, entityStylers[entity.type()], entity === this.selectedEntity_));

        return this;
    }

    // mutator methods

    public init(predators: number, preys: number, options: ContextOptions): Context {

        this.clearEntities();
        this.resetCounters();

        this.options_ = lodash.cloneDeep(options);

        this.addEntities("predator", predators);
        this.addEntities("prey", preys);

        return this;
    }

    public clearEntities(): Context {

        this.entities_ = this.createQuadTree();

        return this;
    }

    public selectEntity(entity: Predator | Prey): Context {

        this.selectedEntity_ = entity;

        return this;
    }

    public clearSelectedEntity(): Context {

        this.selectedEntity_ = undefined;

        return this;
    }

    // query methods

    public entityAt(x: number, y: number, radius: number = 20): Predator | Prey | undefined {

        const entity = this.entities_.find(x, y, radius);

        if(entity === undefined || entity.type() === "food") return undefined;

        return entity as Predator | Prey;
    }

    public selectedEntity(): Predator | Prey | undefined {

        return this.selectedEntity_;
    }

    public area(): Readonly<Dimensions2D> {

        return this.options_.area;
    }

    public entities(): Readonly<Quadtree<Entity>> {

        return this.entities_;
    }

    public options(): Readonly<RemoveUndefinedDeep<ContextOptions>> {

        return this.options_;
    }

    public entityCount(type: EntityType): number {

        return this.counts_[type];
    }
}