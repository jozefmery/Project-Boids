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

type Percieved = Array<{ instance: Prey, dist: number }>;

class Entity {

    /// Protected members

    protected readonly id_: string;

    protected options_: RemoveUndefinedDeep<EntityOptions>;

    protected position_: Vector;
    protected velocity_: Vector;
    protected acceleration_: Vector;

    protected health_: number;

    protected percieved_: Percieved;

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

        this.position_ = createVector(Math.random() * area.width, Math.random() * area.height);

        this.velocity_ = Vector.random2D();
        this.velocity_.setMag(this.options_.speed);

        this.acceleration_ = createVector(0, 0);
        
        this.health_ = 100;
        
        this.percieved_ = [];
    }

    /// Protected methods

    protected isOutsideBoundary(area: Readonly<Dimensions2D>): boolean {

        const { x, y } = this.position_;

        if(x < 0 || x > area.width || y < 0 || y > area.height) {

            return true;
        }

        return false;
    }

    protected wrap(area: Readonly<Dimensions2D>): Entity {

        const { width, height } = area;

        const position = this.position_;

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

        // accelerate forward 
        const acceleration = createVector(this.velocity_);

        acceleration.setMag(this.options_.speed - this.velocity_.mag());
        
        // safety check
        if(this.acceleration_.magSq() && acceleration.magSq()) {

            const factor = 1 - (Math.abs(acceleration.angleBetween(this.acceleration_)) / Math.PI);

            acceleration.mult(factor);
        }
        
        this.acceleration_.add(acceleration);

        return this;
    }

    protected limitAcceleration(): Entity {

        if(this.acceleration_.magSq() === 0) return this;

        this.acceleration_.limit(this.options_.maxForce.magnitude);

        const angle = this.velocity_.angleBetween(this.acceleration_);

        const diff = Math.abs(angle) - this.options_.maxForce.angle;

        if(Math.sign(diff) === 1) {

            this.acceleration_.rotate(-Math.sign(angle) * diff);
        }
        
        return this;
    }

    protected clearAcceleration(): Entity {

        this.acceleration_.mult(0);

        return this;
    }

    protected updateVectors(timeDelta: number): Entity {

        this.limitAcceleration();
        
        this.adjustSpeed();

        this.velocity_.add(Vector.mult(this.acceleration_, timeDelta / 1000));
        this.position_.add(Vector.mult(this.velocity_, timeDelta / 1000));

        this.clearAcceleration();

        return this;
    }

    protected percieve(context: Context): Entity {

        this.percieved_ = Object.values(context.preys()).map(instance => 
            
            ({ instance, dist: this.position_.dist(instance.position()) }))
            
            .filter(pair => {

            // compare based on id not reference
            if(pair.instance.id_ === this.id_) return false;

            // console.log(this.velocity_.angleBetween(Vector.sub(pair.instance.position_, this.position_)) * ( 180 / Math.PI));

            const angle = this.velocity_.angleBetween(Vector.sub(pair.instance.position_, this.position_)) * (180 / Math.PI);

            return pair.dist <= this.options_.perception.radius && Math.abs(angle) <= this.options_.perception.angle / 2;
        });

        return this;
    }

    protected drawPerception(p5: P5): void {
        
        const { radius, angle } = this.options_.perception;

        p5.ellipseMode("radius");
        
        p5.arc(0, 0, radius, radius, p5.radians(- angle / 2), p5.radians(angle / 2), "pie");
    }

    protected drawPercieved(p5: P5): void {      

        
        for(const other of this.percieved_) {
            
            const { x, y } = other.instance.position_;
        
            p5.line(this.position_.x, this.position_.y, x, y);
        }
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

    // update methods

    public update(timeDelta: number, context: Context): Entity {

        this.updateVectors(timeDelta);

        this.collide(context);

        return this;
    }

    public draw(p5: P5, stylers: EntityStylers): Entity {

        stylers.percieved(p5);
        this.drawPercieved(p5);

        p5.push();
        
        p5.translate(this.position_.x, this.position_.y);
        p5.rotate(this.velocity_.heading());
        
        stylers.perception(p5);
        this.drawPerception(p5);
        
        stylers.entity(p5);
        p5.triangle(15, 0, -10, 10, -10, -10);
        
        p5.pop();

        // clear array to prevent redundant copying
        this.percieved_ = [];

        return this;
    }

    public position(): Readonly<Vector> {

        return this.position_;
    }

    public velocity(): Readonly<Vector> {

        return this.velocity_;
    }

    public acceleration(): Readonly<Vector> {

        return this.acceleration_;
    }
};

class Prey extends Entity {

    /// Protected methods

    protected getAlignment(): Vector {

        // shorthands
        const percieved = this.percieved_;

        const alignment = createVector();

        for(const other of percieved) {
            
            alignment.add(other.instance.velocity());
        }

        if(percieved.length) {

            alignment.div(percieved.length);
            alignment.sub(this.velocity_);
            alignment.setMag(this.options_.maxForce.magnitude);
        }

        return alignment;
    }

    protected getCoherence(): Vector {

        // shorthands
        const percieved = this.percieved_;

        const coherence = createVector();

        for(const other of percieved) {
            
            coherence.add(other.instance.velocity());
        }

        if(percieved.length) {

            coherence.div(percieved.length);
            coherence.sub(this.position_);
            coherence.sub(this.velocity_);
            coherence.setMag(this.options_.maxForce.magnitude);
        }

        return coherence;
    }

    protected getSeparation(): Vector {

        // shorthands
        const percieved = this.percieved_;

        const separation = createVector();

        for(const other of percieved) {
            
            const diff = Vector.sub(this.position_, other.instance.position_);
            diff.div(other.dist * other.dist);
            separation.add(diff);
        }

        if(percieved.length) {

            separation.div(percieved.length);
            separation.setMag(this.options_.maxForce.magnitude);
            separation.sub(this.velocity_);
        }

        return separation;
    }

    protected flock(flockOptions: Context["options_"]["flock"]): void {

        if(flockOptions.align) {

            this.acceleration_.add(this.getAlignment()); 
        }

        if(flockOptions.cohere) {

            this.acceleration_.add(this.getCoherence()); 
        }

        if(flockOptions.separate) {

            this.acceleration_.add(this.getSeparation())
        }
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

    protected addEntities(Ctor: Class<Predator> | Class<Prey>, count: number = 1): void {

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
    }

    protected getUpdatedEntities<T extends Entity>(timeDelta: number, entityMap: Map<T>): Map<T> {

        const updatedMap: Map<T> = {};

        for(const id in entityMap) {

            const entity = entityMap[id];

            if(!entity.isAlive()) continue;

            updatedMap[id] = lodash.cloneDeep(entity).update(timeDelta, this) as T;
        }

        return updatedMap;
    }

    protected drawEntities(p5: P5, entityMap: Map<Entity>, stylers: EntityStylers): void {

        for(const id in entityMap) {

            const entity = entityMap[id];

            entity.draw(p5, stylers);
        }
    }

    /// Public methods

    // update methods

    public updatePreys(timeDelta: number): void {

        this.preys_ = this.getUpdatedEntities(timeDelta, this.preys_);
    }

    public updatePredators(timeDelta: number): void {

        this.predators_ = this.getUpdatedEntities(timeDelta, this.predators_);
    }

    public drawPreys(p5: P5, stylers: EntityStylers): void {

        this.drawEntities(p5, this.preys_, stylers);
    }

    public drawPredators(p5: P5, stylers: EntityStylers): void {

        this.drawEntities(p5, this.predators_, stylers);
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