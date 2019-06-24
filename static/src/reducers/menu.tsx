import {Reducer} from 'redux'
export const CHANGE_NAME = "CHANGE_NAME"


export interface IMenu {
    name: string
}

export interface IMenuState {
    name: string;
}

const initialMenuState: IMenuState = {
    name: "",
};

export const MenuReducer: Reducer<IMenuState> = (
    state = initialMenuState,
    action
) => {
    switch(action.type) {
        case CHANGE_NAME: {
            return {
                ...state,
                name: action.name
            };
        }
        default:
            return state;
    }
};