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
import React, { useState } from "react";

// import redux utilities and slices
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../state/themeSlice";
import { setLanguage } from "../../state/languageSlice";

// import UI elements
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import LightIcon from "@material-ui/icons/Brightness7";
import DarkIcon from "@material-ui/icons/Brightness4";
import LanguageIcon from "@material-ui/icons/Translate";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../../stylers";

// import type information
import { StateShape } from "../../state/defaultState";

// import language data
import languageData, { Languages } from "../../lang/all";

// define styles
const UIPanelStyle: Style = Style.create({

    justifyContent: "flex-end",
    paddingRight: "10px",

    position: "fixed",
    // stretch vertically
    top: "0px",
    left: "0px",
    right: "0px",

    // style
    borderStyle: "none",
    borderBottomStyle: "solid"

}, {}, [Style.UIPanel, Style.colorTransition, Style.verticalFlexBox]);

const buttonStyle: Style = Style.create({

    
}, undefined, [Style.topBarButton, Style.colorTransition]);

const tooltipStyle: Style = Style.create(undefined, undefined, Style.simpleTooltip);

const langSelectorStyle: Style = Style.create({

    borderRadius: "10px",
    padding: "5px 10px"

}, undefined, [Style.topBarButton, Style.colorTransition]);

const useTopBarStyles = makeStyles(({ theme }: Theme) => ({

    panel: UIPanelStyle.compose(theme),
    button: buttonStyle.compose(theme),
    tooltip: tooltipStyle.compose(theme)
}));

const useLangSelectorStyles = makeStyles(({ theme }: Theme) => ({

    langSelector: langSelectorStyle.compose(theme)
}));

function useContent() {

    // get data from redux state
    const theme = useSelector((state: StateShape) => state.theme);
    const selectedLanguage = useSelector((state: StateShape) => state.language);

    // select strings based on selected language
    const languageStrings = languageData[selectedLanguage];
    
    // helper
    const themeIsDark = theme === ColorTheme.DARK;

    return {

        themeToggler: themeIsDark ? <LightIcon /> : <DarkIcon />,
        languageSelector: languageStrings.languageName
    }
}

function useTooltip() {

    // get data from redux state
    const theme = useSelector((state: StateShape) => state.theme);
    const selectedLanguage = useSelector((state: StateShape) => state.language);

    // select strings based on selected language
    const languageStrings = languageData[selectedLanguage];
    
    // helper
    const themeIsDark = theme === ColorTheme.DARK;

    return {

        themeToggler: themeIsDark ? languageStrings.setLightTheme : languageStrings.setDarkTheme,
        languageSelector: languageStrings.chooseLanguage
    }
}

function LanguageSelector() {

    // use hooks
    const classes = useLangSelectorStyles();
    const { tooltip: tooltipClass } = useTopBarStyles();
    const tooltips = useTooltip();
    const content = useContent();
    const dispatch = useDispatch();

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {

        setMenuAnchor(event.currentTarget);
    };

    const closeMenu = () => {

        setMenuAnchor(null);
    }

    return <>
            <Tooltip title={tooltips.languageSelector} 
                        placement="bottom" 
                        TransitionComponent={Zoom}
                        classes={{ tooltip: tooltipClass }}>
                <Button className={classes.langSelector} 
                        startIcon={<LanguageIcon/>} 
                        endIcon={<ExpandMoreIcon/>}
                        onClick={openMenu}>
                    {content.languageSelector}
                </Button>
            </Tooltip>
            <Menu anchorEl={menuAnchor} 
                keepMounted 
                open={Boolean(menuAnchor)}
                onClose={closeMenu}>

                {Object.values(Languages).map(language => 
                
                    <MenuItem key={language} onClick={() => {
                                
                                    dispatch(setLanguage(language));
                                    closeMenu();
                    }}>

                        {languageData[language].languageName}
                    </MenuItem>
                )}

            </Menu>
        </>;
}

export default function TopBar() {

    // use hooks
    const classes = useTopBarStyles();
    const dispatch = useDispatch();
    const tooltips = useTooltip();
    const content = useContent();

    return (
        <div className={classes.panel}>

            <LanguageSelector />
            <Tooltip title={tooltips.themeToggler} 
                    placement="bottom" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip: classes.tooltip }}>
                <Button className={classes.button} onClick={() => dispatch(toggleTheme()) }>
                    {content.themeToggler}
                </Button>
            </Tooltip>
        </div>);
}