/**
 * File: hooks/stringWithHotkey.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 2.5.2020
 * License: none
 * Description: Defines a hook for using localized language strings in combination
 *              with a hotkey string representation.
 * 
 */

// import redux utilities 
import { useSelector } from "react-redux";

// import utilites
import lodash from "lodash";

// import hooks
import { useLanguageString } from "./languageString";

// import type information
import { StateShape } from "../types/redux";
import { LanguageStrings } from "../lang/all";
import { Action } from "../actions";

function format(str: string, sequences: string | Array<string>): string {

    let sequenceArray: Array<string>;

    if(typeof sequences === "string") {

        sequenceArray = [sequences];
    
    } else {

        sequenceArray = sequences;
    }                                                 

    // assume valid keys without redundant spaces or characters
    const sequenceString = 
        sequenceArray.map(sequence => sequence.split(" ")   // split sequence to a combination array
        .map(combination => combination.split("+")          // split each combination to keys
        .map(key => lodash.capitalize(key))                 // capitalize each key
        .join(" + "))                                       // rejoin keys
        .join(" "))                                         // rejoin combinations
        .join(", ");                                        // join sequences to a single string

    // format strings 
    if(sequenceString.length) {
        
        return `${str} [${sequenceString}]`;
    }

    return str;
}

export function useStringWithHotkeys(str: LanguageStrings, action: Action): string {

    const hotkeys = useSelector((state: StateShape) => state.hotkeys);

    const languageString = useLanguageString(str);

    const settings = hotkeys[action];

    if(settings) {

        return format(languageString, settings.sequences);
    }

    return languageString;
}