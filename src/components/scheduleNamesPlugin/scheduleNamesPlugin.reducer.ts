import * as scheduleNameActions from './scheduleNamesPlugin.actions';

export const initialState = {
  scheduleNames: {},
  scheduleNameIds: [],
};

export function scheduleNameReducer(state: any = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case scheduleNameActions.CREATE_SCHEDULE_NAME:
      state = {
        scheduleNames: {
          ...state.scheduleNames,
          [payload.id]: { ...payload },
        },
        scheduleNameIds: state.scheduleNameIds.concat(payload.id),
      };
      return state;
    case scheduleNameActions.UPDATE_SCHEDULE_NAME:
      state = {
        ...state,
        scheduleNames: {
          ...state.scheduleNames,
          [payload.id]: { ...payload },
        },
      };
      return state;
    case scheduleNameActions.DELETE_SCHEDULE_NAME:
      state = {
        ...state,
        scheduleNameIds: state.scheduleNameIds.filter((id: any) => id !== payload.id),
      };
      delete state.scheduleNames[payload.id];
      return state;
    default:
      return state;
  }
}
