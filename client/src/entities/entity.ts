/**
 * File: entity.ts
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
import { Dimensions2D } from "../types";
import { Class, RemoveUndefinedDeep } from "../types";

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
        coherence?: number;
        separation?: number;
    }
};

type Styler = (p5: P5) => void;

type EntityStylers = {

    prey: {

        default: Styler;
        highlight: Styler;
    };
    predator: {

        default: Styler;
        highlight: Styler;
    };
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

export type EntityType = "predator" | "prey";

export class Entity {

    /// Protected members

    protected readonly type_: EntityType;
 
    protected readonly id_: string;

    protected options_: RemoveUndefinedDeep<EntityOptions>;

    protected forces_: EntityForces;

    protected draft_: {

        forces_: EntityForces;
    };

    protected health_: number;

    protected vicinity_: Vicinity;

    protected percieved_: Vicinity;

    /// Constructor function
    
    protected constructor(context: Readonly<Context>, type: EntityType) {

        // shorthand
        const area = context.area();

        this.type_ = type;
        this.id_ = uniqid();

        this.options_ = {

            speed: 100,
            maxForce: {

                magnitude: 20,
                angle: (2 / 3) * Math.PI
            },

            perception: {

                radius: 150,
                angle: 170
            },

            collisionRadius: 20,

            flockingModifier: {

                alignment: 1.0,
                coherence: 1.0,
                separation: 1.0
            }
        };

        this.forces_ = {

            position: createVector(),
            velocity: createVector(),
            acceleration: createVector()
        };

        this.forces_.position.set(Math.random() * area.width, Math.random() * area.height);

        this.forces_.velocity.set(Vector.random2D());
        this.forces_.velocity.setMag(this.options_.speed);

        this.draft_ = {

            forces_: lodash.cloneDeep(this.forces_)
        };
        
        this.health_ = 100;
        
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

        acceleration.limit(this.options_.maxForce.magnitude);

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

    protected drawEntity(p5: P5, stylers: EntityStylers, highlighted: boolean): Entity {

        // shorthands
        const { position, velocity } = this.forces();

        p5.push();
        
        const highlightStyler = highlighted ? "highlight" : "default";

        stylers[this.type_][highlightStyler](p5);

        p5.translate(position.x, position.y);
        p5.rotate(velocity.heading());
        
        p5.triangle(15, 0, -10, 10, -10, -10);
        
        p5.pop();

        return this;
    }

    protected drawPerception(p5: P5, stylers: EntityStylers, highlighted: boolean): Entity {
        
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

    protected drawPercieved(p5: P5, stylers: EntityStylers, highlighted: boolean): Entity {      

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

    public setHealth(health: number): Entity {

        this.health_ = lodash.clamp(health, 0, 100);

        return this;
    }

    public kill(): Entity {

        this.setHealth(0);
        
        return this;
    }

    public setOptions(options: EntityOptions): Entity {

        this.options_ = lodash.merge(this.options_, options);

        return this;
    }

    // query methods

    public isAlive(): boolean {

        return this.health_ > 0;
    }

    public health(): number {

        return this.health_;
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

        this.updateVectors(timeDelta);

        this.collide(context);

        return this;
    }

    public draw(p5: P5, stylers: EntityStylers, highlighted: boolean = false): Entity {

        this.drawPerception(p5, stylers, highlighted);
        this.drawEntity(p5, stylers, highlighted);
        this.drawPercieved(p5, stylers, highlighted);
        
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

    public constructor(context: Context) {

        super(context, "prey");
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
            alignment.sub(velocity);
            alignment.setMag(this.options_.maxForce.magnitude);
        }

        return alignment.mult(this.options_.flockingModifier.alignment);
    }

    protected getCoherence(percieved: Vicinity): Vector {

        // shorthands
        const { position, velocity } = this.draft().forces_;

        const coherence = createVector();

        for(const other of percieved) {
            
            coherence.add(other.instance.position());
        }

        if(percieved.length) {

            coherence.div(percieved.length);
            coherence.sub(position);
            coherence.sub(velocity);
            coherence.setMag(this.options_.maxForce.magnitude);
        }

        return coherence.mult(this.options_.flockingModifier.coherence);
    }

    protected getSeparation(percieved: Vicinity): Vector {

        // shorthands
        const { position, velocity } = this.draft().forces_;

        const separation = createVector();

        for(const other of percieved) {
            
            const diff = Vector.sub(position, other.instance.position());
            diff.div(other.dist * other.dist);
            separation.add(diff);
        }

        if(percieved.length) {

            separation.div(percieved.length);
            separation.sub(velocity);
            separation.setMag(this.options_.maxForce.magnitude);
        }

        return separation.mult(this.options_.flockingModifier.separation);
    }

    protected flock(flockOptions: Context["options_"]["flock"]): Prey {

        const { acceleration } = this.draft().forces_;

        const preys = this.getPercievedType("prey");
        
        if(flockOptions.align) {

            acceleration.add(this.getAlignment(preys)); 
        }

        if(flockOptions.cohere) {

            acceleration.add(this.getCoherence(preys)); 
        }

        if(flockOptions.separate) {

            acceleration.add(this.getSeparation(preys))
        }

        return this;
    }

    /// Public methods

    public update(timeDelta: number, context: Context): Prey {

        this.clearAcceleration();

        this.vicinity(context);

        this.flock(context.options().flock);

        super.update(timeDelta, context);

        return this;
    }
};

class Predator extends Entity {

    /// Constructor function

    public constructor(context: Context) {

        super(context, "predator");
    }
};

type ContextOptions = {

    onBoundaryHit?: "wrap" | "kill";
    flock?: {

        align?: boolean;
        cohere?: boolean;
        separate?: boolean;
    }

    drawQuadtree?: boolean;
}

export class Context {

    /// Protected members

    protected entities_: Quadtree<Entity>;
    protected area_: Dimensions2D;

    protected options_: RemoveUndefinedDeep<ContextOptions>;

    protected selectedEntity_: Entity | undefined;

    protected counts_: {

        [type in EntityType]: number;
    };

    /// Contructor function

    constructor(area: Readonly<Dimensions2D>) {

        this.area_ = area;
        
        this.options_ = {
            
            onBoundaryHit: "wrap",
            flock: {
                
                align: true,
                cohere: true,
                separate: true
            },

            drawQuadtree: false
        }

        this.entities_ = this.createQuadTree();

        this.selectedEntity_ = undefined;

        this.counts_ = {

            predator: 0,
            prey: 0
        };
    }

    /// Protected static methods

    protected static typeToConstructor(type: EntityType): Class<Entity> {

        switch(type) {

            case "prey": return Prey;
            case "predator": return Predator;
        }
    }

    /// Protected methods

    protected createQuadTree(): Quadtree<Entity> {

        return quadtree<Entity>()
            .x(entity => entity.position().x)
            .y(entity => entity.position().y)
            .cover(this.area_.width, this.area_.height);
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

        this.forEach(entity => entity.draw(p5, stylers, entity === this.selectedEntity_));

        return this;
    }

    // mutator methods

    public addEntities(type: EntityType, count: number): Context {

        for(let i = 0; i < count; ++i) {

            this.entities_.add(new (Context.typeToConstructor(type))(this));
        }

        return this;
    }

    public clearEntities(): Context {

        this.entities_ = this.createQuadTree();

        return this;
    }

    public setArea(area: Readonly<Dimensions2D>): Context {

        this.area_ = lodash.cloneDeep(area);

        return this;
    }

    public setOptions(options: Readonly<ContextOptions>): Context {

        this.options_ = lodash.merge(this.options_, options);

        return this;
    }

    public selectEntity(entity: Entity): Context {

        this.selectedEntity_ = entity;

        return this;
    }

    public clearSelectedEntity(): Context {

        this.selectedEntity_ = undefined;

        return this;
    }

    // query methods

    public entityAt(x: number, y: number, radius: number = 20): Entity | undefined {

        return this.entities_.find(x, y, radius);
    }

    public selectedEntity(): Entity | undefined {

        return this.selectedEntity_;
    }

    public area(): Readonly<Dimensions2D> {

        return this.area_;
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