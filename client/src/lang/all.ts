/**
 * File: data.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 3.3.2020
 * License: none
 * Description: Exports an object containing all indexable language data. Defines interfaces for language data.
 * 
 */

// import language data
import en from "./en";
import sk from "./sk";

/**
 * 
 * Defines the shape of any given language.
 */
export interface ILanguageDefinition {

    title: string;
    play: string;
    pause: string;
    setDarkTheme: string;
    setLightTheme: string;
    chooseLanguage: string;
    languageName: string;
};

/**
 * 
 * Defines available languages.
 */
export enum Languages {

    EN,
    SK
}

/**
 * 
 * Gathers data of various languages into a single indexable object.
 */
const languageData = {

    [Languages.EN]: en,
    [Languages.SK]: sk
};

// export all languages
export default languageData;