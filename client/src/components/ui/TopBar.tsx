/**
 * File: TopBar.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains various helper components.
 * 
 */

// import react
import React from "react";

// import redux utilities and slices
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../state/themeSlice";

// import UI elements
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import LightIcon from "@material-ui/icons/Brightness7";
import DarkIcon from "@material-ui/icons/Brightness4";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../../stylers";

// import type information
import { StateShape } from "../../state/defaultState";

// import language data
import languageData from "../../lang/all";

// define styles
const UIPanelStyle: Style = Style.create({

    position: "fixed",
    // stretch vertically
    top: "0px",
    left: "0px",
    right: "0px",

    // spacing
    padding: "10px",

    // style
    borderStyle: "none",
    borderBottomStyle: "solid"

}, {}, ["UIPanel", "ColorTransition", "VerticalFlexBox"]);

const buttonStyle: Style = Style.create({

    "&:first-child": {

        marginLeft: "auto"
    }
}, undefined, ["TopBarButton", "ColorTransition"]);

const tooltipStyle: Style = Style.create(undefined, undefined, "SimpleTooltip");

const useTopBarStyles = makeStyles(({ theme }: Theme) => ({

    panel: UIPanelStyle.compose(theme),
    button: buttonStyle.compose(theme),
    tooltip: tooltipStyle.compose(theme)
}));

type TopBarElements = "themeToggler";

const mapStateToProps = ({ theme, language }: StateShape) => ({ theme, language });
type TopBarProps = ReturnType<typeof mapStateToProps>;

function getIcon(props: TopBarProps, element: TopBarElements): React.ReactNode {

    // --- shorthands 
    const theme = props.theme;
    // --- shorthands

    const themeIsDark = theme === ColorTheme.DARK;

    switch(element) {

        case "themeToggler":

            return themeIsDark ? <LightIcon /> : <DarkIcon />;
    }
}

function getTooltip(props: TopBarProps, element: TopBarElements): string {

    // --- shorthands 
    const theme = props.theme;
    const currentLanguage = languageData[props.language];
    // --- shorthands

    const themeIsDark = theme === ColorTheme.DARK;

    switch(element) {

        case "themeToggler":

            return themeIsDark ? currentLanguage["setLightTheme"] : currentLanguage["setDarkTheme"];
    }
}

export default function TopBar() {

    // get data from redux store
    const props = useSelector(mapStateToProps);

    // get style classes
    const classes = useTopBarStyles();

    const dispatch = useDispatch();

    return (
        <div className={classes.panel}>
            <Tooltip title={getTooltip(props, "themeToggler")} 
                    placement="top" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: classes.tooltip }}>
                <Button className={classes.button} onClick={() => dispatch(toggleTheme()) }>
                    {getIcon(props, "themeToggler")}
                </Button>
            </Tooltip>
        </div>);
}