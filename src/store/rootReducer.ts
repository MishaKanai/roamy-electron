import documentsReducer from "roamy/lib/SlateGraph/store/reducer";
import { History } from "history";
import { connectRouter } from "connected-react-router";
import drawingsReducer from "roamy/lib/Excalidraw/store/reducer";

const dataLocationReducer = (state = false, action: any) => {
  if (action.type === "LOAD_DIR") {
    return action.payload.dir;
  }
  return state;
};

const createRootReducer = (history: History) => {
  const router = connectRouter(history);
  const rootReducer = (state: any, action: any) => {
    return {
      dataLocation: dataLocationReducer(state?.dataLocation, action),
      router: router(state?.router, action),
      documents:
        action.type === "LOAD_DIR"
          ? action.payload.fileContents.documents
          : documentsReducer(state?.documents, action),
      drawings:
        action.type === "LOAD_DIR"
          ? action.payload.fileContents.drawings
          : drawingsReducer(state?.drawings, action),
    };
  };
  return rootReducer;
};
export default createRootReducer;
