/**
 * File: types/utils.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 15.4.2020
 * License: none
 * Description: Defines various helper types.
 * 
 */

export type Position2D = {

    x: number;
    y: number;
};

export type Dimensions2D = {

    width: number;
    height: number;
};

export type Function = (...args: Array<any>) => any;

export type GenericClass = {

    new (...args: any[]): any;
    [index: string]: any;
};

export type Class<T> = {
    
    new (...args: any[]): T;
    [index: string]: any;
};

export type RemoveUndefinedDeep<T> = { [P in keyof T]-?: RemoveUndefinedDeep<NonNullable<T[P]>> };