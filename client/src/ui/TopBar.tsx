/**
 * File: ui/TopBar.jsx
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 29.2.2020
 * License: none
 * Description: Defines a UI panel which contains various helper components.
 * 
 */

// import react
import React, { useState } from "react";

// import redux utilities
import { useSelector } from "react-redux";

// import actions
import { useAction } from "../actions";

// import UI elements
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import LightIcon from "@material-ui/icons/Brightness7";
import DarkIcon from "@material-ui/icons/Brightness4";
import LanguageIcon from "@material-ui/icons/Translate";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// import hooks
import { useLanguageString } from "../hooks/languageString";
import { useStringWithHotkeys } from "../hooks/stringWithHotkey";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../stylers";

// import type information
import { StateShape } from "../types/redux";

// import language data
import languageData, { Languages } from "../lang/all";

/// Shared styles

const buttonStyle = Style.create({}, {}, [Style.topBarButton]);

const tooltipStyle = Style.create({}, {}, [Style.tooltip]);

const useSharedStyles = makeStyles(({ theme }: Theme) => ({

    button: buttonStyle.compose(theme),
    tooltip: tooltipStyle.compose(theme)
}));

/// Title

const titleStyle = Style.create({

    margin: "3px",
    marginRight: "auto",

    fontSize: "20px"

}, {}, [Style.textColor]);

const useTitleStyle = makeStyles(({ theme }: Theme) => ({

    title: titleStyle.compose(theme)

}));

function Title() {

    // get styles
    const classes = useTitleStyle();

    // get language strings
    const title = useLanguageString("title");

    return  <div className={classes.title}>
                {title}
            </div>;
}

const langSelectorStyle: Style = Style.create({

    borderRadius: "10px",
    padding: "5px 10px",
    fontSize: "15px"

}, {}, [Style.topBarButton]);

/// Language selector

const langSelectorMenu: Style = Style.create({}, {}, Style.menu);

const langSelectorMenuItem: Style = Style.create({}, {}, Style.menuItem);

const useLangSelectorStyles = makeStyles(({ theme }: Theme) => ({

    langSelector: langSelectorStyle.compose(theme),
    menu: langSelectorMenu.compose(theme),
    menuItem: langSelectorMenuItem.compose(theme)

}));

function LanguageSelector() {

    // get actions
    const setLanguage = useAction("setLanguage");

    // get state from redux
    const selectedLanguage = useSelector((state: StateShape) => state.global.language);

    // get styles
    const { tooltip } = useSharedStyles();
    const classes = useLangSelectorStyles();

    // get language strings
    const chooseLanguage = useStringWithHotkeys("chooseLanguage", "cycleLanguages");
    const languageName = useLanguageString("languageName");

    // menu state
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    // menu togglers
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {

        setMenuAnchor(event.currentTarget);
    };

    const closeMenu = () => {

        setMenuAnchor(null);
    }

    return <>
            <Tooltip title={chooseLanguage} 
                        placement="bottom" 
                        TransitionComponent={Zoom}
                        classes={{ tooltip }}>
                <Button className={classes.langSelector} 
                        startIcon={<LanguageIcon/>} 
                        endIcon={<ExpandMoreIcon/>}
                        onClick={openMenu}>
                    {languageName}
                </Button>
            </Tooltip>
            <Menu anchorEl={menuAnchor} 
                keepMounted 
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                classes={{ paper: classes.menu }}>
                {Object.values(Languages).map(language => 
                
                    <MenuItem key={language} onClick={() => {
                                
                                    setLanguage(language);
                                    closeMenu();
                                }}
                        selected={selectedLanguage === language}
                        classes={{ root: classes.menuItem }}>

                        {languageData[language].languageName}
                    </MenuItem>
                )}
            </Menu>
        </>;
}

/// Theme toggler

function ThemeToggler() {

    // get actions
    const toggleTheme = useAction("toggleTheme");

    // get state from redux
    const theme = useSelector((state: StateShape) => state.global.theme);

    // get styles
    const { tooltip, ...classes } = useSharedStyles();

    // get language strings
    const setLightTheme = useStringWithHotkeys("setLightTheme", "toggleTheme");
    const setDarkTheme = useStringWithHotkeys("setDarkTheme", "toggleTheme");

    // helpers
    const themeIsDark = theme === ColorTheme.DARK;

    return <Tooltip title={themeIsDark ? setLightTheme : setDarkTheme} 
                    placement="bottom" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip }}>
                <Button className={classes.button} onClick={() => toggleTheme() }>
                    {themeIsDark ? <LightIcon /> : <DarkIcon />}
                </Button>
            </Tooltip>
}

/// Stats toggler

function StatsToggler() {

    // get actions
    const toggleStats = useAction("toggleStatsOpen");

    // get state from redux
    const isOpen = useSelector((state: StateShape) => state.global.statsOpen);

    // get styles
    const { tooltip, ...classes } = useSharedStyles();

    // get language strings
    const openStats = useStringWithHotkeys("openStats", "toggleStatsOpen");
    const closeStats = useStringWithHotkeys("closeStats", "toggleStatsOpen");

    return <Tooltip title={isOpen ? closeStats : openStats} 
                    placement="bottom" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip }}>
                <Button className={classes.button} onClick={() => toggleStats() }>
                    {<DonutLargeIcon />}
                </Button>
            </Tooltip>
}

/// Top Bar 

const panelStyle = Style.create({

    // position inside grid
    justifySelf: "stretch",
    alignSelf: "stretch",
    gridColumn: "1 / 2",
    gridRow: "1 / 2",

    // flexbox
    justifyContent: "flex-end",

    // spacing
    padding: "0px 10px",

    // style
    borderStyle: "none",
    borderBottomStyle: "solid"

}, {}, [Style.panel, Style.verticalFlexBox]);

const useTopBarStyles = makeStyles(({ theme }: Theme) => ({

    panel: panelStyle.compose(theme)

}));

export default function() {

    // get styles
    const classes = useTopBarStyles();

    return (
        <div className={classes.panel}>
            <Title />
            <LanguageSelector />
            <ThemeToggler />
            <StatsToggler />
        </div>);
}