import {Reducer} from 'redux'
import {ThemeActionTypes} from '../actions/theme'

export interface ITheme {
    theme: string
}
export interface IThemeState {
    readonly theme: string
}

let savedTheme = localStorage.getItem('theme')
let themeToState = 'light'
if(savedTheme === 'light') {
    themeToState = 'light'
}
if(savedTheme === 'dark') {
    themeToState = 'dark'
}
const initialThemeState: IThemeState = {
    theme: themeToState
}

export const ThemeReducer: Reducer<IThemeState> = (
    state = initialThemeState,
    action
) => {
    switch(action.type) {
        case ThemeActionTypes.SET_DARK: {
            return  {
                ...state,
                theme: 'dark'
            }
        }
        case ThemeActionTypes.SET_LIGHT: {
            return  {
                ...state,
                theme: 'light'
            }
        }
        default:
            return state
    }
}
