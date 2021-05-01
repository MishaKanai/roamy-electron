import React from "react";
import ReactDOM from "react-dom";
import "roamy/src/index.css";
import { getApp } from "roamy/lib/App";
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
const epicMiddleware = createEpicMiddleware();

const {
  __REDUX_DEVTOOLS_EXTENSION__: installDevTools = () => (f: any) => f,
} = window as any;

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
const App = getApp(history);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <LandingPage>
        <div>
          {/* <input
            type="file"
            onClick={(e) => {
              (window as any).postMessage({
                type: "select-dirs",
              });
            }}
          /> */}
          <App />
        </div>
      </LandingPage>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

/*
  Probably we want to use epics in order to handle debounced write-to-file.

  That way we have better control, and can fire off 'success' or 'failure' actions to the front-end.
*/
store.subscribe(() => {
  const state = store.getState();
  console.log({
    state,
  });
});
