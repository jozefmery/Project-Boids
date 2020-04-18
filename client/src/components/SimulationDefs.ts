/**
 * File: SimulationDefs.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 18.4.2020
 * License: none
 * Description: Definitions for Simulation defined in a separate file to prevent circular dependencies
 * 
 */

export enum SimZoomTarget {

    CURSOR,
    CENTER
};

export const simulationBindings = [

    "moveCameraLeft",
    "moveCameraUp",      
    "moveCameraRight",   
    "moveCameraDown"

] as const;

export type SimulationBindings = typeof simulationBindings[number];