import { Reducer } from "redux";
import { NotifyActionTypes } from "../actions/notify";

export interface INotifyState {
  notifications: any;
}

const initialNotifyState = {
  notifications: []
};

export const NotifyReducer: Reducer<INotifyState> = (
  state = initialNotifyState,
  action
) => {
  switch (action.type) {
    case NotifyActionTypes.ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification
          }
        ]
      };

    case NotifyActionTypes.CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          action.dismissAll || notification.key === action.key
            ? { ...notification, dismissed: true }
            : { ...notification }
        )
      };

    case NotifyActionTypes.REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== action.key
        )
      };
    default:
      return state;
  }
};
