import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageIcon from '@material-ui/icons/Language'
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync'
import AddIcon from '@material-ui/icons/Add'
import InvertColors from '@material-ui/icons/InvertColors'
import Tooltip from '@material-ui/core/Tooltip'
import {History} from 'history';
import { ITheme } from '../../reducers/theme';
import { connect } from 'react-redux';
import { IAppState } from '../../reducers'
import './Menu.css'

import * as themeActions from '../../actions/theme'
import { IDraft } from '../../reducers/drafts';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      color: "#00b5ad!important"
    }
  }),
);

interface IPropsFromState{
  history: History,
  theme: ITheme,
  drafts: any
}

interface IPropsFromDispatch {
  toggleTheme: (theme: string) => void
}

type AllTypes = IPropsFromState & IPropsFromDispatch

function MenuBar(props: AllTypes) {
  // console.log(props.theme.theme)
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function toggleTheme() {
    const theme = props.theme.theme === "light" ? "dark" : "light";
    props.toggleTheme(theme)
    // document.documentElement.classList.add("color-theme-in-transition");
    document.documentElement.setAttribute("data-theme", theme);
    // window.setTimeout(() => {
    //   document.documentElement.classList.remove("color-theme-in-transition");
    // }, 1000);
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon /> 
          </IconButton> */}
          {/* intermental */}
          <Typography onClick={() => {props.history.push('/')}} variant="h6" color="inherit" className={classes.title}>
            intermental
          </Typography>
          <Tooltip title="change theme">
            <IconButton onClick={() => {toggleTheme()}}>
              <InvertColors />
            </IconButton>
          </Tooltip>
          <Tooltip title="sync local posts">
            <IconButton>
              <SyncIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
          <strong style={{color: "orange"}}>drafts: {Object.keys(props.drafts.drafts[0]).length}</strong>
          <Tooltip title="change language">
            <IconButton
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          EN
          <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>English</MenuItem>
            <MenuItem onClick={handleClose}>Russian</MenuItem>
            {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
          </Menu>
          <Button onClick={() => {props.history.push('/book/add')}} color="inherit">
            <AddIcon fontSize="small" />
            New book
          </Button>
          <Button color="inherit">Read book by hash</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connect(
  state => (state: IAppState)  => ({
    menu: state.menuState,
    drafts: state.draftsState,
    theme: state.themeState
  }),
  dispatch => (dispatch: any): IPropsFromDispatch => ({
    toggleTheme: (theme: string) => dispatch(themeActions.toggleTheme(theme))
})
)(MenuBar);