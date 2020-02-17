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

export { Capitalize, Clamp };
