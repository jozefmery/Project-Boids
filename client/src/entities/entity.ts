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

export class Entity {

    /// Protected members

    protected readonly id_: string;

    protected speed_: number;
    protected force_: {

        min: number;
        max: number;
    };

    protected position_: P5.Vector = new P5.Vector();
    protected velocity_: P5.Vector = new P5.Vector();
    protected acceleration_: P5.Vector = new P5.Vector();

    protected perception_: {

        radius: number;
        angle: number;
    };

    protected health_: number;

    /// Constructor function
    
    public constructor(context: Readonly<Context>) {

        // shorthand
        const area = context.area();
        
        this.id_ = uniqid();

        this.speed_ = Math.random() * 20 + 70;

        this.force_ = {

            min: 1,
            max: 20
        };

        this.position_.set(Math.random() * area.width, Math.random() * area.height);

        this.velocity_ = P5.Vector.random2D();
        this.velocity_.setMag(this.speed_);

        this.acceleration_.set(0, 0);
        
        this.perception_ = {

            radius: 100,
            angle: 360

        };

        this.health_ = 100;
    }

    /// Protected methods

    protected isOutsideBoundary(area: Readonly<Dimensions2D>): boolean {

        const { x, y } = this.position_;

        if(x < 0 || x > area.width || y < 0 || y > area.height) {

            return true;
        }

        return false;
    }

    protected wrap(area: Readonly<Dimensions2D>) {

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
    }

    protected collide(context: Context): void {

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
    }

    protected getSpeedAdjust(): P5.Vector {

        const speedAdjust = new P5.Vector();
        speedAdjust.set(this.velocity_);
        speedAdjust.setMag(this.speed_ - this.velocity_.mag());
        
        if(this.acceleration_.mag() && speedAdjust.mag()) {

            const factor = 1 - (Math.abs(speedAdjust.angleBetween(this.acceleration_)) / Math.PI);

            speedAdjust.mult(factor);
        }
        
        return speedAdjust;
    }

    /// Public methods

    // mutator methods

    public kill(): Entity {

        this.health_ = 0;
        
        return this;
    }

    // query methods

    public isAlive(): boolean {

        return this.health_ > 0;
    }

    public id(): string {

        return this.id_;
    }

    // update methods

    public update(timeDelta: number, context: Context): Entity {

        this.acceleration_.limit(this.force_.max);

        const speedAdjust = this.getSpeedAdjust();

        this.acceleration_.add(speedAdjust);

        this.velocity_.add(P5.Vector.mult(this.acceleration_, timeDelta / 1000));
        
        console.log(this.velocity_.mag());

        this.position_.add(P5.Vector.mult(this.velocity_, timeDelta / 1000));

        this.collide(context);

        this.acceleration_.mult(0);

        return this;
    }

    public draw(p5: P5): Entity {

        p5.push();

        p5.translate(this.position_.x, this.position_.y);
        p5.rotate(this.velocity_.heading());

        p5.triangle(15, 0, -10, 10, -10, -10);
        p5.pop();

        return this;
    }

    public position(): P5.Vector {

        return this.position_;
    }

    public velocity(): P5.Vector {

        return this.velocity_;
    }
};

class Prey extends Entity {

    /// Protected methods

    protected getPercieved(context: Context): Array<Prey> {

        return Object.values(context.preys()).filter(other => {

            if(other.id_ === this.id_) return false;

            const distance = this.position_.dist(other.position());

            // console.log(distance);

            return distance <= this.perception_.radius;
        });
    }

    protected getAlignment(percieved: Array<Prey>): P5.Vector {

        const alignment = new P5.Vector();
        alignment.set(0, 0);

        for(const other of percieved) {
            
            alignment.add(other.velocity());
        }

        if(percieved.length) {

            alignment.div(percieved.length);
            alignment.sub(this.velocity_);
            alignment.setMag(this.speed_);
        }

        return alignment;
    }

    protected getCoherence(percieved: Array<Prey>): P5.Vector {

        const coherence = new P5.Vector();
        coherence.set(0, 0);

        for(const other of percieved) {
            
            coherence.add(other.velocity());
        }

        if(percieved.length) {

            coherence.div(percieved.length);
            coherence.sub(this.position_);
            coherence.sub(this.velocity_);
            coherence.setMag(this.speed_);
        }

        return coherence;
    }

    protected getSeparation(percieved: Array<Prey>): P5.Vector {

        const separation = new P5.Vector();
        separation.set(0, 0);

        for(const other of percieved) {
            
            const diff = P5.Vector.sub(this.position_, other.position_);
            const dist = this.position_.dist(other.position_);
            diff.div(dist * dist);
            separation.add(diff);
        }

        if(percieved.length) {

            separation.div(percieved.length);
            separation.setMag(this.speed_);
            separation.sub(this.velocity_);
        }

        return separation;
    }

    protected flock(flockOptions: Context["options_"]["flock"], percieved: Array<Prey>): void {

        if(flockOptions.align) {

            this.acceleration_.add(this.getAlignment(percieved)); 
        }

        if(flockOptions.cohere) {

            this.acceleration_.add(this.getCoherence(percieved)); 
        }

        if(flockOptions.separate) {

            this.acceleration_.add(this.getSeparation(percieved))
        }
    }

    /// Public methods

    public update(timeDelta: number, context: Context): Prey {

        const percieved = this.getPercieved(context);

        this.flock(context.options().flock, percieved);

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

    protected drawEntities(p5: P5, entityMap: Map<Entity>): void {

        for(const id in entityMap) {

            const entity = entityMap[id];

            entity.draw(p5)
        }
    }

    /// Public methods

    // update methods

    public updatePreys(timeDelta: number): void {

        this.preys_ = this.getUpdatedEntities(timeDelta, this.preys_);
    }

    public updatePredators(timeDelta: number): void {

        // this.getUpdatedEntities(timeDelta, this.predators_);
    }

    public drawPreys(p5: P5): void {

        this.drawEntities(p5, this.preys_);
    }

    public drawPredators(p5: P5): void {

        this.drawEntities(p5, this.predators_);
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