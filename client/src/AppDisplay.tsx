// TODO header

// import react
import React, { useEffect } from "react";

// import font
import "typeface-roboto";

// import custom components
import Simulation from "./ui/Simulation";
import Controls from "./ui/Controls";
import TopBar from "./ui/TopBar";
import Stats from "./ui/Stats";

// import hooks
import { useLanguageString } from "./hooks/languageString";

// import stylers
import { makeStyles } from "@material-ui/core/styles";

function useSetTitle() {

    const title = useLanguageString("title");

    useEffect(() => {

        document.title = title;
        
    }, [title]);
}

const useUILayoutStyle = makeStyles({

    layout: {

        position: "absolute",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",

        pointerEvents: "none",

        "& *": {

            pointerEvents: "auto"
        },

        display: "grid",
        gridTemplate: "min-content auto min-content / auto"
    }

});

export default function() {

    useSetTitle();

    const classes = useUILayoutStyle();

    return (
    <>
        <Simulation />
        <div className={classes.layout}>
            <TopBar />
            <Stats />
            <Controls />
        </div>
    </>);
}