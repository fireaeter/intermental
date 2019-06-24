import {Reducer} from 'redux'
import { LoadingActionTypes } from '../actions/loading';

export interface ILoading {
    loading: boolean
}

export interface ILoadingState {
    loading: boolean;
}

const initialLoadingState: ILoadingState = {
    loading: false,
};

export const LoadingReducer: Reducer<ILoadingState> = (
    state = initialLoadingState,
    action
) => {
    switch(action.type) {
        case LoadingActionTypes.START: {
            return {
                ...state,
                loading: true
            };
        }
        case LoadingActionTypes.END: {
            return {
                ...state,
                loading: false
            }
        }
        default:
            return state;
    }
};