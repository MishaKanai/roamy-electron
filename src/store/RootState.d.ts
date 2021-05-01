import { RootState as _RootState } from 'roamy/lib/store/createRootReducer';
export interface RootState extends _RootState {
    dataLocation: string | boolean,
}