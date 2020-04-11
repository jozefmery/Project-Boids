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
 * @param   {Class} classObject      Class object (constructor function) whose static methods are to be ran.
 * @param   {RegExp} nameCondition?  Condition for running a static method.
 * @returns {void}
 */
function runStaticMethods(classObject: Class, nameCondition?: RegExp): void {

    Object.getOwnPropertyNames(classObject).forEach((property: string) => {

        const value = classObject[property];
        if(typeof value === "function" && (nameCondition === undefined || nameCondition.test(property))) value();
    });
};

export { runStaticMethods };