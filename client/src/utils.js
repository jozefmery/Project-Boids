/**
 * File: utils.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.1.2020
 * License: none
 * Description:
 * 
 */

function Capitalize(string) {

    if(typeof string !== "string" || string.length === 0) return "" 

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(); 
}

function Clamp(num, min, max) {

    return Math.min(Math.max(num, min), max);
}

function DispatchToProps(sliceArray) {

    let converter = {};

    for(let idx in sliceArray) {
        
        const item = sliceArray[idx];

        for(let key in item.actions) {
            
            converter[key] = item.actions[key];
        }
    }

    return converter;
};

export { Capitalize, Clamp, DispatchToProps };
