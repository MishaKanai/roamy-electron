import { combineEpics } from "redux-observable";
import * as mapActionsToMain from './mapActionsToMain'
const rootEpic = combineEpics(
    ...Object.values(mapActionsToMain)
)
export default rootEpic