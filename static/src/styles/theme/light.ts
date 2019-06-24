import { createMuiTheme } from '@material-ui/core';
import red from '@material-ui/core/colors/red'

const theme_light = createMuiTheme({
  palette: {
      primary: {
          main: '#1769aa',
          contrastText: '#000000'
        },
      background: {
          default: '#ffffff'
      },
      secondary: {
        main: red.A400,
        light: red.A200,
        dark: red.A700,
        contrastText: '#000',
      },
      type: "light"
}});

export default theme_light;