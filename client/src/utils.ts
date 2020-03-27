/**
 * File: utils.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description: Defines various simple helper functions.
 * 
 */

 /**
  * 
  * Transforms a string's first character to upper case and the rest to lower.
  * 
  * @param  {string} target String to be transformed.
  * @returns string         Transformed string.
  */
function capitalize(target: string): string {

    return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase(); 
}
/**
 * 
 * Clamps a number between two numbers.
 * Throws error if min is greater than max.
 * 
 * @param  {number} target  Number to be clamped.
 * @param  {number} min     Lower bound.
 * @param  {number} max     Upper bound.
 * @returns number          Clamped number.
 */
function clamp(target: number, min: number, max: number): number {

    if(min > max) throw new Error("Minimal value shouldn't be greater than the maximal value");

    return Math.min(Math.max(target, min), max);
}

/**
 * 
 * Defines the shape of classes.
 */
interface Class {

    new (...args: any[]): any;
    [index: string]: any;
}
/**
 * 
 * Runs every static method of a class which satisfies a regular expression.
 * Omit regular expression to run every static method.
 * Visibility operators are not considered.
 * 
 * @param  {Class} classObject      Class object (constructor function) whose static methods are to be ran.
 * @param  {RegExp} nameCondition?  Condition for running a static method.
 * @returns void
 */
function runStaticMethods(classObject: Class, nameCondition?: RegExp): void {

    Object.getOwnPropertyNames(classObject).forEach((property: string) => {

        const value = classObject[property];
        if(typeof value === "function" && (nameCondition === undefined || nameCondition.test(property))) value();
    });
};

export { capitalize, clamp, runStaticMethods };