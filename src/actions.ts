import { createDocAction, deleteDocAction, updateDocAction } from 'roamy/lib/SlateGraph/store/actions';
import { RootAction as _RootAction } from 'roamy/src/store/action';
import { ActionType } from 'typesafe-actions';

type CreateDocAction = ActionType<typeof createDocAction>;
type UpdateDocAction = ActionType<typeof updateDocAction>;
type DeleteDocAction = ActionType<typeof deleteDocAction>;
type MappedCreate = Omit<CreateDocAction, 'type'> & { type: '$CREATE_DOC'}
type MappedUpdate = Omit<UpdateDocAction, 'type'> & { type: '$UPDATE_DOC'}
type MappedDelete = Omit<DeleteDocAction, 'type'> & { type: '$DELETE_DOC'}

export type RootAction = _RootAction | MappedCreate | MappedDelete | MappedUpdate;