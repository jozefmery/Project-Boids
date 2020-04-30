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

export class Entity {

    /// Protected members

    protected readonly id_: string;

    protected position_: P5.Vector = new P5.Vector();
    protected velocity_: P5.Vector = new P5.Vector();
    protected acceleration_: P5.Vector = new P5.Vector();

    protected perceptionRadius_: number;

    protected alive_: boolean;

    /// Constructor function
    
    public constructor(context: Readonly<Context>) {

        // shorthand
        const area = context.area();
        
        this.id_ = uniqid();

        this.position_.x = Math.random() * area.width;
        this.position_.y = Math.random() * area.height;

        this.velocity_ = P5.Vector.random2D();
        this.velocity_.setMag(Math.random() * 90 + 10);
        
        this.perceptionRadius_ = 100;

        this.alive_ = true;
    }

    /// Protected methods

    protected flock(context: Readonly<Context>): void {

    }

    /// Public methods

    // mutator methods

    public kill(): Entity {

        this.alive_ = false;
        
        return this;
    }

    // query methods

    public isAlive(): boolean {

        return this.alive_;
    }

    public id(): string {

        return this.id_;
    }

    // update methods

    public update(timeDelta: number, context: Context): void {

        this.flock(context);
        this.position_.add(P5.Vector.mult(this.velocity_, timeDelta / 1000));
        // this.velocity.add(P5.Vector.mult(this.acceleration, timeDelta / 1000));
    }

    public draw(p5: P5): void {

        p5.push();
        p5.fill(255);
        p5.stroke(0);
        p5.strokeWeight(2);

        p5.translate(this.position_.x, this.position_.y);
        p5.rotate(this.velocity_.heading());

        p5.triangle(15, 0, -10, 10, -10, -10);
        p5.pop();
    }
};

type EntityMap = {

    [id: string]: Entity;
}

export class Context {

    /// Protected members

    protected entities_: EntityMap;
    protected area_: Dimensions2D;

    /// Contructor function

    constructor(area: Readonly<Dimensions2D>) {

        this.entities_ = {};

        this.area_ = area;
    }

    /// Protected methods

    /// Public methods

    // update methods

    public updateAll(timeDelta: number): void {

        for(const id in this.entities_) {

            const entity = this.entities_[id];

            if(!entity.isAlive()) {

                delete this.entities_[id];
            }

            entity.update(timeDelta, this);
        }
    }

    public drawAll(p5: P5): void {

        for(const id in this.entities_) {

            const entity = this.entities_[id];

            entity.draw(p5)
        }
    }

    // mutator methods

    public add(count: number = 1): Context {

        for(let i = 0; i < count; ++i) {

            const entity = new Entity(this);

            this.entities_[entity.id()] = entity;
        }

        return this;
    }

    public clear(): Context {

        this.entities_ = {};

        return this;
    }

    public setArea(area: Readonly<Dimensions2D>): Context {

        this.area_ = lodash.cloneDeep(area);

        return this;
    }

    // query methods

    public area(): Readonly<Dimensions2D> {

        return this.area_;
    }

    public entities(): Readonly<EntityMap> {

        return this.entities_;
    }
}