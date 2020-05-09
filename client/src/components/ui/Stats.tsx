// TODO header

// import react
import React from "react";

// import utilities
import classNames from "classnames";

// import p5
import P5Sketch, { P5 } from "../P5Sketch";

// import redux utilities
import { useSelector } from "react-redux";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style } from "../../stylers";

// import type information
import { StateShape } from "../../state/types";

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

// const selectedEntityStyles = Style.create();

// const useSelectedEntityStyles = makeStyles()

function SelectedEntity() {

    const loop = (p5: P5) => {

        p5.background("white");
    };

    return (
        <div>
            <P5Sketch dimensions={{ width: 100, height: 100 }} loop={loop}/>
        </div>);
}

const panelWrapperStyle = Style.create({

    // position inside grid
    justifySelf: "end",
    gridColumn: "1 / 2",
    gridRow: "2 / 4",

    marginTop: "-1px",

    transform: "translateX(100%)",

    transition: "transform .5s linear",

    "&.open": {

        transform: "translateX(0%)"
    },
    
    width: "350px"
});

const panelStyle = Style.create({

    width: "100%",
    height: "100%",

    borderStyle: "none",
    borderLeftStyle: "solid"

}, {}, [Style.panel, Style.colorTransition]);


const usePanelStyles = makeStyles(({ theme }: Theme) => ({
    
    panelWrapper: panelWrapperStyle.compose(theme),
    panel: panelStyle.compose(theme)
}));

export default function() {

    const classes = usePanelStyles();

    const isOpen = useSelector((state: StateShape) => state.stats.open);

    return (
        <div className={classNames(classes.panelWrapper, { "open": isOpen })}>
            <div className={classes.panel}>
            {/* <SelectedEntity /> */}
            </div>
        </div>);
}