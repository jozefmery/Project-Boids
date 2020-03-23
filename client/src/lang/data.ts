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

interface ILanguageDefinition {

    title: string;
    play: string;
    pause: string;
};

interface ILanguages {

    [index: string]: ILanguageDefinition;
}

const languageData: ILanguages = {

    en,
    sk
};

export default languageData;