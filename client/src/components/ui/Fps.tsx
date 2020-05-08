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

const fpsStyle = Style.create({

    position: "absolute",
    left: "0",
    bottom: "0",

    padding: "5px",

    fontSize: "20px",
    fontWeight: 500

}, {}, [Style.colorTransition, Style.textColor]);

const useFpsStyles = makeStyles(({ theme }: Theme) => ({
    
    fps: fpsStyle.compose(theme)
}));

export default function() {

    const fps = useSelector((state: StateShape) => state.sim.fps);

    const classes = useFpsStyles();

    return <div className={classes.fps}>{`FPS: ${fps.toFixed(2)}`}</div>
}