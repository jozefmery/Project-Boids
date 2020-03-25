/**
 * File: utils.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description: Defines various simple helper functions.
 * 
 */

function capitalize(target: string): string {

    return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase(); 
}

function clamp(target: number, min: number, max: number): number {

    if(min > max) throw new Error("Minimal value shouldn't be greater than the maximal value");

    return Math.min(Math.max(target, min), max);
}

interface Class {

    new (...args: any[]): any;
    [index: string]: any;
}

function runStaticMethods(classObject: Class, nameCondition?: RegExp): void {

    Object.getOwnPropertyNames(classObject).forEach((property: string) => {

        const value = classObject[property];
        if(typeof value === "function" && (nameCondition === undefined || nameCondition.test(property))) value();
    });
};

export { capitalize, clamp, runStaticMethods };