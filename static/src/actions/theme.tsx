import { Dispatch } from 'redux';

export enum ThemeActionTypes {
    SET_LIGHT = 'SET_LIGHT',
    SET_DARK = 'SET_DARK'
}

export interface IThemeSetDarkAction {
    type: ThemeActionTypes.SET_DARK
}
export interface IThemeSetLightAction {
    type: ThemeActionTypes.SET_LIGHT
}
export type ThemeActions = IThemeSetDarkAction | IThemeSetLightAction

export const toggleTheme = (theme: string) => (dispatch: Dispatch) =>{
    if(theme === 'light') {
        localStorage.setItem('theme', 'light')
        dispatch({
            type: ThemeActionTypes.SET_LIGHT
        })
    }
    if(theme === 'dark') {
        localStorage.setItem('theme', 'dark')
        dispatch({
            type: ThemeActionTypes.SET_DARK
        })
    }
}