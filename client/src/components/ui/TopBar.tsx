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
import { toggleTheme, setLanguage } from "../../state/globalSlice";

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

// import hooks
import { useLanguageString } from "../../hooks/UseLanguageString";

// import stylers
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Style, ColorTheme } from "../../stylers";

// import type information
import { StateShape } from "../../state/types";

// import language data
import languageData, { Languages } from "../../lang/all";

/// Shared styles

const buttonStyle = Style.create({}, undefined, [Style.topBarButton, Style.colorTransition]);

const tooltipStyle = Style.create(undefined, undefined, Style.tooltip);

const useSharedStyles = makeStyles(({ theme }: Theme) => ({

    button: buttonStyle.compose(theme),
    tooltip: tooltipStyle.compose(theme)
}));

/// Title

const titleStyle = Style.create({

    margin: "3px",
    marginRight: "auto",

    fontSize: "20px"

}, {}, [Style.textColor, Style.colorTransition]);

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

}, undefined, [Style.topBarButton, Style.colorTransition]);

/// Language selector

const langSelectorMenu: Style = Style.create({}, {}, [Style.menu]);

const langSelectorMenuItem: Style = Style.create({}, {}, [Style.menuItem]);

const useLangSelectorStyles = makeStyles(({ theme }: Theme) => ({

    langSelector: langSelectorStyle.compose(theme),
    menu: langSelectorMenu.compose(theme),
    menuItem: langSelectorMenuItem.compose(theme)

}));

function LanguageSelector() {

    // get dispatch and state from redux
    const selectedLanguage = useSelector((state: StateShape) => state.global.language);
    const dispatch = useDispatch();

    // get styles
    const { tooltip } = useSharedStyles();
    const classes = useLangSelectorStyles();

    // get language strings
    const chooseLanguage = useLanguageString("chooseLanguage");
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
                                
                                    dispatch(setLanguage(language));
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

    // get dispatch and state from redux
    const theme = useSelector((state: StateShape) => state.global.theme);
    const dispatch = useDispatch();

    // get styles
    const { tooltip, ...classes } = useSharedStyles();

    // get language strings
    const setLightTheme = useLanguageString("setLightTheme");
    const setDarkTheme = useLanguageString("setDarkTheme");

    // helpers
    const themeIsDark = theme === ColorTheme.DARK;

    return <Tooltip title={themeIsDark ? setLightTheme : setDarkTheme} 
                    placement="bottom" 
                    TransitionComponent={Zoom}
                    classes={{ tooltip }}>
                <Button className={classes.button} onClick={() => dispatch(toggleTheme()) }>
                    {themeIsDark ? <LightIcon /> : <DarkIcon />}
                </Button>
            </Tooltip>
}

/// Top Bar 

const panelStyle = Style.create({

    justifyContent: "flex-end",
    padding: "0px 10px",

    position: "fixed",
    // stretch vertically
    top: "0px",
    left: "0px",
    right: "0px",

    // style
    borderStyle: "none",
    borderBottomStyle: "solid"

}, {}, [Style.panel, Style.colorTransition, Style.verticalFlexBox]);

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
        </div>);
}