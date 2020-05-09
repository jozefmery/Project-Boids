// TODO header

// import react
import React from "react";

// import redux utilities
import { useSelector } from "react-redux";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style } from "../../stylers";

// import type information
import { StateShape } from "../../state/types";

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",

    marginTop: "-1px",

    borderStyle: "none",
    borderLeftStyle: "solid",

    width: "350px",

    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.4)"

}, {}, [Style.panel, Style.colorTransition]);


// const panelStyle = Style.create({

//     justifySelf: "start",

//     gridColumnStart: "1",
//     gridRowStart: "2",
//     gridRowEnd: "4",

//     background: "red",

//     padding: "5px",

//     fontSize: "20px",
//     fontWeight: 500

// }, {}, [Style.colorTransition, Style.textColor]);


const usePanelStyles = makeStyles(({ theme }: Theme) => ({
    
    panel: panelStyle.compose(theme)
}));

export default function() {

    // const fps = useSelector((state: StateShape) => state.sim.fps);

    const classes = usePanelStyles();

    return <div className={classes.panel}></div>
}