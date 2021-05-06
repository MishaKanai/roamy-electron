const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const fs = require('fs');
const { setMainMenu } = require('./main-menu');
const AppData_Store = require('electron-store');

const fileStore = new AppData_Store({
	currentFile: {
		type: 'string',
	}
});
const initialFile = fileStore.get('currentFile');

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;
}







// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// in the main store
const { forwardToRenderer, triggerAlias, replayActionMain, } = require('electron-redux');
const { createStore, applyMiddleware }  = require('redux');

const { default: documentsReducer } = require('roamy/lib/SlateGraph/store/reducer');
const { default: drawingsReducer } = require('roamy/lib/Excalidraw/store/reducer');
const { combineReducers } = require('redux');


const _rootReducer = combineReducers({
  dataLocation: (state = false, action) => {
    if (action.type === 'LOAD_DIR') {
      return action.payload.dir
    }
    return state;
  },
  documents: (state, action) => {
    if (action.type === 'LOAD_DIR') {
      return action.payload.fileContents.documents
    }
    return documentsReducer(state, action)
  },
  drawings: (state, action) => {
    if (action.type === 'LOAD_DIR') {
      return action.payload.fileContents.drawings
    }
    return drawingsReducer(state, action)
  }
})
const rootReducer = (state, _action) => {
  const action = _action.type.startsWith('$') ? {
    ..._action,
    type: _action.type.slice(1)
   } : _action
  return _rootReducer(state, action);
}

let initialState = initialFile ? (() => {
  const serialized =  fs.readFileSync(initialFile, { encoding: 'utf-8'})
  return {
    dataLocation: initialFile,
    documents: serialized?.documents ? JSON.parse(serialized.documents) : {},
    drawings: serialized?.drawings ? JSON.parse(serialized.drawings) : {}
  }
})() : undefined;
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    triggerAlias,
    // ...otherMiddleware,
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

replayActionMain(store);

const debounce = require('lodash/debounce');
const writeFile = debounce(() => {
  const state = store.getState()
  console.log(state);
  if (state.dataLocation) {
    const { drawings = {}, documents = {} } = state;
    const serialize = {
      documents,
      drawings
    }
    fs.writeFileSync(state.dataLocation, JSON.stringify(serialize, null, 1));
  }
}, 1000)

store.subscribe(writeFile)








// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  setMainMenu(win, store, fileStore)
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
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