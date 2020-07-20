/**
 * File: hooks/languageString.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 19.4.2020
 * License: none
 * Description: Defines a hook for using localized language strings.
 * 
 */

// import redux utilities 
import { useSelector } from "react-redux";

// import language data
import languageData, { LanguageStrings } from "../lang/all";

// import type information
import { StateShape } from "../types/redux";

export function useLanguageString(str: LanguageStrings) {

    const selectedLanguage = useSelector((state: StateShape) => state.global.language);

    return languageData[selectedLanguage][str];
}