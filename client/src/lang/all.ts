/**
 * File: lang/all.ts
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
export type LanguageDefinition = {

    title: string;
    play: string;
    pause: string;
    setDarkTheme: string;
    setLightTheme: string;
    chooseLanguage: string;
    languageName: string;
    centerCameraToArea: string;
    currentSpeed: string;
    increaseSpeed: string;
    decreaseSpeed: string;
    currentScale: string;
    zoomIn: string;
    zoomOut: string;
    openStats: string;
    closeStats: string;
    selectedEntity: string;
    entities: string;
    noSelectedEntity: string;
    predator: string;
    prey: string;
    clearSelection: string;
    entityType: string;
    id: string;
    position: string;
    velocity: string;
    acceleration: string;
    health: string;
    elapsed: string;
};

/**
 * 
 * Defines available language strings as a union type.
 */
export type LanguageStrings = keyof LanguageDefinition;

/**
 * 
 * Defines available languages.
 */
export enum Languages {

    EN = "en",
    SK = "sk"
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