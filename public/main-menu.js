const { app, Menu } = require('electron');
const isWindows = process.platform === 'win32';
const { showOpenDialog } = require('./dialogs')
module.exports = {
    setMainMenu
}

function setMainMenu(mainWindow, store, fileStore) {
    const template = [
        {
            label: isWindows ? 'File' : app.getName(),
            submenu: [
                {
                    label: 'Open file',
                    click() {
                        showOpenDialog(mainWindow, store, fileStore)
                    }
                },
                {
                    label: isWindows ? 'Exit' : `Quit ${app.getName()}`,
                    accelerator: isWindows ? 'Alt+F4' : 'CmdOrCtrl+Q',
                    click() {
                        app.quit();
                    }
                },
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}


