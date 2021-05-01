import { Epic } from "redux-observable";
import * as frontendActions from "roamy/lib/SlateGraph/store/actions";
import { RootState } from "roamy/lib/store/createRootReducer";
import { RootAction } from "../actions";
import { Services } from "../services";
import { filter, map } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";

export const mapCreateAction: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, services) => {
  return action$.pipe(
    filter(isActionOf(frontendActions.createDocAction)),
    map((action) => {
      return {
        ...action,
        type: "$CREATE_DOC",
      };
    })
  );
};

export const mapUpdateAction: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, services) => {
  return action$.pipe(
    filter(isActionOf(frontendActions.updateDocAction)),
    map((action) => {
      return {
        ...action,
        type: "$UPDATE_DOC",
      };
    })
  );
};
export const mapDeleteAction: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, services) => {
  return action$.pipe(
    filter(isActionOf(frontendActions.deleteDocAction)),
    map((action) => {
      return {
        ...action,
        type: "$DELETE_DOC",
      };
    })
  );
};
