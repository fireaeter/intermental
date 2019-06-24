export enum LoadingActionTypes {
    START = 'START',
    END = 'END'
  }
  
  // Interface for Get All Action Type
  export interface ILoadingStartAction {
    type: LoadingActionTypes.START;
  }
  export interface ILoadingEndAction {
    type: LoadingActionTypes.END;
  }

export default LoadingActionTypes