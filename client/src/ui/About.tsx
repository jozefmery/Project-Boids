/**
 * File: ui/About.tsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 18.5.2020
 * License: none
 * Description: Defines a side panel with some basic information about the application.
 * 
 */

// import react
import React from "react";

// import redux utilities
import { useSelector } from "react-redux";

// import hooks
import { useLanguageString } from "../hooks/languageString";

// import stylers
import { makeStyles } from "@material-ui/core/styles";
import { Style } from "../stylers";

// import type information
import { StateShape } from "../types/redux";

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",
    zIndex: 1,

    marginTop: "-1px",

    fontSize: "18px",

    transform: (isOpen: boolean) => `translateX(${isOpen ? 0 : 100}%)`,

    transition: "transform .3s ease-in-out",

    borderStyle: "none",
    borderLeftStyle: "solid",

    padding: "15px 25px",

    overflowY: "auto",

    alignItems: "flex-start",

    "& > *:not(:last-child)": {

        paddingBottom: "15px"
    } 

}, {}, [Style.panel, Style.textColor, Style.verticalFlexBox]);

const usePanelStyles = makeStyles(({ theme }) => ({

    panel: panelStyle.compose(theme)
}));

export default function() {

    const isOpen = useSelector((state: StateShape) => state.global.sidePanel) === "about";

    const { panel } = usePanelStyles(isOpen);

    const authorString = useLanguageString("author");
    const lastChangeString = useLanguageString("lastChange");

    return (
        <div className={panel}>
            <div>{`${authorString}: Jozef Méry`}</div>
            <div>{`${lastChangeString}: 18.05.2020`}</div>
        </div>);
}