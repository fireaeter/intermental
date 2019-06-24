import { Dispatch } from "redux";

export enum NotifyActionTypes {
  ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR",
  CLOSE_SNACKBAR = "CLOSE_SNACKBAR",
  REMOVE_SNACKBAR = "REMOVE_SNACKBAR"
}

export const enqueueSnackbar = notification => {
  const key = notification.options && notification.options.key;

  return {
    type: NotifyActionTypes.ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random()
    }
  };
};

export const closeNotify = key => (dispatch: Dispatch) => {
  dispatch({
    type: NotifyActionTypes.CLOSE_SNACKBAR,
    dismissAll: !key,
    key
  });
};

export const removeSnackbar = key => ({
  type: NotifyActionTypes.REMOVE_SNACKBAR,
  key
});

export default NotifyActionTypes;
