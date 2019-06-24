import { Dispatch } from 'redux';
export const CHANGE_NAME = "CHANGE_NAME"


export const setName = (name: string) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: CHANGE_NAME,
            name: name
        })
    }    
}