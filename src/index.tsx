import React from "react";
import ReactDOM from "react-dom";
import "roamy/src/index.css";
import "./index.css";
import { getApp } from "roamy/lib/App";
import { drawingOptionsContext } from 'roamy/lib/extension/drawingOptionsContext'
import { Provider } from "react-redux";
import replayActionRenderer from "electron-redux/dist/helpers/replayActionRenderer";
import getInitialStateRenderer from "electron-redux/dist/helpers/getInitialStateRenderer";
import { forwardToMainWithParams } from "electron-redux/dist/middleware/forwardToMain";
import { applyMiddleware, createStore, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import rootEpic from "./epics/rootEpic";
import { createBrowserHistory } from "history";
import { LandingPage } from "./landingPage/components/LandingPage";
import createRootReducer from "./store/rootReducer";
import { routerMiddleware } from "connected-react-router";
import querystring from "querystring";
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ConnectedDrawing from "./ConnectedDrawing";

const remote = require("electron").remote;
const isDev = require("electron-is-dev");
const path = require("path");

function createTraceWindow(drawingId: string) {
  const win = new remote.BrowserWindow({
    width: 800,
    height: 800,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      // copied from above
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const appPath = remote.app.getAppPath();
  alert(appPath);
  win.loadURL(
    (isDev
      ? "http://localhost:3000"
      : `file://${path.join(appPath, "./build/index.html")}`) + "?draw=true&drawingId=" + drawingId
  );
  // TODO SET MENU HERE <-
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

const epicMiddleware = createEpicMiddleware();

const {
  __REDUX_DEVTOOLS_EXTENSION__: installDevTools = () => (f: any) => f,
} = window as any;

let query = querystring.parse(global.location.search);
console.log({ query });

const initialState = getInitialStateRenderer();

const history = createBrowserHistory();
const rootReducer = createRootReducer(history);
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      epicMiddleware,
      forwardToMainWithParams({
        blacklist: [/^@@.*/, /^UPDATE_DOC$/, /^CREATE_DOC$/, /^DELETE_DOC$/],
      })
    ),
    installDevTools()
  )
);
epicMiddleware.run(rootEpic as any);

replayActionRenderer(store as any);

if (query["?draw"]) {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <div style={{ height: "100%", width: "100%" }}>
          <div
            className="draggable"
            style={{
              width: "100%",
              height: "30px",
              backgroundColor: "lightgray",
            }}
          >
            Some text here. Maybe filename?
          </div>
          <div style={{ height: "calc(100vh - 60px)" }}>
          <ConnectedDrawing drawingName={query['drawingId'] as string} />
          </div>
          <div
            className="draggable"
            style={{
              width: "100%",
              height: "30px",
              backgroundColor: "lightgray",
            }}
          >
            Footer text?
          </div>
        </div>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
} else {
  const App = getApp(history);
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <LandingPage>
          <pre style={{ backgroundColor: "white" }}>
            {JSON.stringify(query)}
          </pre>
          <button
            onClick={(e) => {
              createTraceWindow('drawing-1');
            }}
          >
            create-draw-window
          </button>
          <div>
            {/* <input
              type="file"
              onClick={(e) => {
                (window as any).postMessage({
                  type: "select-dirs",
                });
              }}
            /> */}
            <drawingOptionsContext.Provider value={{ renderDrawingOptions: ({ drawingId }) => {
                return <IconButton size="small" onClick={() => createTraceWindow(drawingId)}>
                  <OpenInNewIcon />
                </IconButton>
            }}}>
              <App />
            </drawingOptionsContext.Provider>
          </div>
        </LandingPage>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
