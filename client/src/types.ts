/**
 * File: types.ts
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