/**
 * File: entity.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 24.4.2020
 * License: none
 * Description: 
 * 
 */

// import utilities
import lodash from "lodash";
import uniqid from "uniqid";

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
};

type Styler = (p5: P5) => void;

type EntityStylers = {

    entity: Styler;
    perception: Styler;
    percieved: Styler;
};

type PercievedEntities = Array<{ instance: Prey, dist: number }>;

type EntityForces = {

    position: Vector;
    velocity: Vector;
    acceleration: Vector;
};

class Entity {

    /// Protected members

    protected readonly id_: string;

    protected options_: RemoveUndefinedDeep<EntityOptions>;

    protected forces_: EntityForces;

    protected draft_: {

        forces_: EntityForces;
    };

    protected health_: number;

    protected percieved_: PercievedEntities;

    /// Constructor function
    
    public constructor(context: Readonly<Context>) {

        // shorthand
        const area = context.area();
        
        this.id_ = uniqid();

        this.options_ = {

            speed: 100,
            maxForce: {

                magnitude: 50,
                angle: (2 / 3) * Math.PI
            },

            perception: {

                radius: 100,
                angle: 220
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

        this.clearAcceleration();

        return this;
    }

    protected percieve(context: Context): Entity {

        // shorthands
        const { position, velocity } = this.draft().forces_;

        this.percieved_ = Object.values(context.preys()).map(instance => 
            
            ({ instance, dist: position.dist(instance.position()) }))
            
            .filter(pair => {

            if(pair.instance.id_ === this.id_) return false;

            const angle = velocity.angleBetween(Vector.sub(pair.instance.position(), position)) * (180 / Math.PI);

            return pair.dist <= this.options_.perception.radius && Math.abs(angle) <= this.options_.perception.angle / 2;
        });

        return this;
    }

    protected drawEntity(p5: P5, stylers: EntityStylers): Entity {

        // shorthands
        const { position, velocity } = this.forces();

        p5.push();
        
        stylers.entity(p5);

        p5.translate(position.x, position.y);
        p5.rotate(velocity.heading());
        
        p5.triangle(15, 0, -10, 10, -10, -10);
        
        p5.pop();

        return this;
    }

    protected drawPerception(p5: P5, stylers: EntityStylers): Entity {
        
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

    protected drawPercieved(p5: P5, stylers: EntityStylers): Entity {      

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

        this.health_ = 0;
        
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

    public draw(p5: P5, stylers: EntityStylers, highlighted = false): Entity {

        if(highlighted) {

            this.drawPerception(p5, stylers);
        }
        
        this.drawEntity(p5, stylers);
        
        if(highlighted) {

            this.drawPercieved(p5, stylers);
        }

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

    /// Protected methods

    protected getAlignment(): Vector {

        // shorthands
        const percieved = this.percieved_;
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

        return alignment;
    }

    protected getCoherence(): Vector {

        // shorthands
        const percieved = this.percieved_;
        const { position, velocity } = this.draft().forces_;

        const coherence = createVector();

        for(const other of percieved) {
            
            coherence.add(other.instance.velocity());
        }

        if(percieved.length) {

            coherence.div(percieved.length);
            coherence.sub(position);
            coherence.sub(velocity);
            coherence.setMag(this.options_.maxForce.magnitude);
        }

        return coherence;
    }

    protected getSeparation(): Vector {

        // shorthands
        const percieved = this.percieved_;
        const { position, velocity } = this.draft().forces_;

        const separation = createVector();

        for(const other of percieved) {
            
            const diff = Vector.sub(position, other.instance.position());
            diff.div(other.dist * other.dist);
            separation.add(diff);
        }

        if(percieved.length) {

            separation.div(percieved.length);
            separation.setMag(this.options_.maxForce.magnitude);
            separation.sub(velocity);
        }

        return separation;
    }

    protected flock(flockOptions: Context["options_"]["flock"]): Prey {

        const { acceleration } = this.draft().forces_;

        if(flockOptions.align) {

            acceleration.add(this.getAlignment()); 
        }

        if(flockOptions.cohere) {

            acceleration.add(this.getCoherence()); 
        }

        if(flockOptions.separate) {

            acceleration.add(this.getSeparation())
        }

        return this;
    }

    /// Public methods

    public update(timeDelta: number, context: Context): Prey {

        this.percieve(context);

        this.flock(context.options().flock);

        super.update(timeDelta, context);

        return this;
    }
};

class Predator extends Entity {

};

type Map<T> = {

    [id: string]: T;
}

type ContextOptions = {

    onBoundaryHit?: "wrap" | "kill";
    flock?: {

        align?: boolean;
        cohere?: boolean;
        separate?: boolean;
    } 
}

export class Context {

    /// Protected members

    protected predators_: Map<Predator>;
    protected preys_: Map<Prey>;
    protected area_: Dimensions2D;

    protected options_: RemoveUndefinedDeep<ContextOptions>;

    /// Contructor function

    constructor(area: Readonly<Dimensions2D>) {

        this.predators_ = {};
        this.preys_ = {};

        this.area_ = area;

        this.options_ = {

            onBoundaryHit: "wrap",
            flock: {

                align: true,
                cohere: true,
                separate: true
            }
        }
    }

    /// Protected methods

    protected addEntities(Ctor: Class<Predator> | Class<Prey>, count: number = 1): Context {

        let map: Map<Entity>;

        if(Ctor === Prey) {

            map = this.preys_;
        
        } else { // Predator

            map = this.predators_
        }

        for(let i = 0; i < count; ++i) {

            const entity = new Ctor(this);

            map[entity.id()] = entity;
        }

        return this;
    }

    protected updateEntities<T extends Entity>(timeDelta: number, entityMap: Map<T>): Context {

        for(const id in entityMap) {

            const entity = entityMap[id];

            entity.update(timeDelta, this);

            if(!entity.isAlive()) {

                delete entityMap[id];
            }
        }

        for(const id in entityMap) {

            entityMap[id].applyDraft();
        }

        return this;
    }

    protected drawEntities<T extends Entity>(p5: P5, entityMap: Map<T>, stylers: EntityStylers): Context {

        for(const id in entityMap) {

            const entity = entityMap[id];

            entity.draw(p5, stylers);
        }

        return this;
    }

    /// Public methods

    // update methods

    public updatePreys(timeDelta: number): Context {

        this.updateEntities(timeDelta, this.preys_);

        return this;
    }

    public updatePredators(timeDelta: number): Context {

        this.updateEntities(timeDelta, this.predators_);

        return this;
    }

    public drawPreys(p5: P5, stylers: EntityStylers): Context {

        this.drawEntities(p5, this.preys_, stylers);

        return this;
    }

    public drawPredators(p5: P5, stylers: EntityStylers): Context {

        this.drawEntities(p5, this.predators_, stylers);

        return this;
    }

    // mutator methods

    public addPreys(count: number = 1): Context {

        this.addEntities(Prey, count);

        return this;
    }

    public addPredators(count?: number): Context {

        this.addEntities(Predator, count);

        return this;
    }

    public clearPreys(): Context {

        this.preys_ = {};

        return this;
    }

    public clearPredators(): Context {

        this.predators_ = {};

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

    // query methods

    public area(): Readonly<Dimensions2D> {

        return this.area_;
    }

    public preys(): Readonly<Map<Prey>> {

        return this.preys_;
    }

    public predators(): Readonly<Map<Predator>> {

        return this.predators_;
    }

    public options(): Readonly<RemoveUndefinedDeep<ContextOptions>> {

        return this.options_;
    }
}