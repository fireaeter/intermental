import { createMuiTheme } from '@material-ui/core';
import red from '@material-ui/core/colors/red'

const theme_dark = createMuiTheme({
  palette: {
      primary: {
          main: '#1769aa',
          contrastText: '#ffffff'
        },
      background: {
          default: '#424242',
      },
      secondary: {
        main: red.A400,
        light: red.A200,
        dark: red.A700,
        contrastText: '#000',
      },
      type: "dark"
}});


export default theme_dark;