/**
 * File: utils.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description: Defines various simple helper functions.
 * 
 */

// import dependencies
import { Slice, 
        ActionCreatorWithPayload,
        ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

function capitalize(target: string): string {

    return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase(); 
}

function clamp(target: number, min: number, max: number): number {

    return Math.min(Math.max(target, min), max);
}

interface DispatchToPropsMap {

    [index: string]: ActionCreatorWithPayload<any, string> | ActionCreatorWithoutPayload<string>;
}

function dispatchToProps(sliceArray: Slice[]): DispatchToPropsMap {

    let converter: DispatchToPropsMap = {};

    sliceArray.forEach(slice => {

        for(let action in slice.actions) {

            converter[action] = slice.actions[action];
        }
    });

    return converter;
};

interface Class<T> {

    new (...args: any[]): T;
    [index: string]: any;
}

function runStaticMethods<T>(classObject: Class<T>, nameCondition?: RegExp): void {

    Object.getOwnPropertyNames(classObject).forEach((property: string) => {

        const value = classObject[property];
        if(typeof value === "function" && (nameCondition === undefined || nameCondition.test(property))) value();
    });
};

export { capitalize, clamp, dispatchToProps, runStaticMethods };
