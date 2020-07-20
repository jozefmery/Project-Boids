/**
 * File: public/electron.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 20.5.2020
 * License: none
 * Description: Electron application entry point.
 * 
 */

const isDev = require("electron-is-dev");
const path = require("path");
const { app, BrowserWindow } = require("electron");

function createWindow () {

    // Create the browser window.
    const window = new BrowserWindow({

        width: 800,
        height: 600,
        webPreferences: {

            nodeIntegration: true
        }
    });

    if(isDev) {

        window.loadURL("http://localhost:3000");
        window.webContents.openDevTools();
    
    } else {

        window.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
        window.removeMenu();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {

        app.quit();
    }
});

app.on("activate", () => {
    
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {

        createWindow();
    }
});
