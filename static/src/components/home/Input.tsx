import React from "react";
import { History } from "history";
import { useState } from "react";
import { IAppState } from "../../reducers";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";

import * as searchActions from "../../actions/search";
import * as notifyActions from "../../actions/notify";

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center"
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4
    }
  })
);

interface IPropsFromState {
  history: History;
  loading: boolean;
}

interface IPropsFromDispatch {
  search: (query: string) => void;
  showNotify: (text: string, type: string) => void;
  closeNotify: (key) => void;
}
type AllProps = IPropsFromState & IPropsFromDispatch;

function Input(props: AllProps) {
  const [formData, setFormData] = useState({
    query: ""
  });

  const updateFormData = value =>
    setFormData({
      ...formData,
      query: value
    });

  const onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSearch();
    }
  };
  const handleSearch = () => {
    if (query.length === 0) {
      props.showNotify("query field must be filled", "error");
    } else {
      props.search(query);
      props.history.push("/search/" + query);
    }
  };

  const { query } = formData;
  const classes = useStyles();

  return (
    <div style={{ textAlign: "center" }}>
      <Paper className={classes.root} elevation={1}>
        <InputBase
          className={classes.input}
          value={query}
          onKeyDown={e => onEnterPress(e)}
          onChange={e => updateFormData(e.target.value)}
          placeholder="Search local books"
        />
        <Tooltip title="go">
          <IconButton
            onClick={() => handleSearch()}
            className={classes.iconButton}
            aria-label="Search"
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Divider className={classes.divider} />
        <Tooltip title="clear">
          <IconButton
            color="secondary"
            onClick={e => updateFormData("")}
            className={classes.iconButton}
            aria-label="Clear"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );
}

export default connect(
  state => (state: IAppState) => ({
    loading: state.loadingState.loading
  }),
  dispatch => (dispatch: any): IPropsFromDispatch => ({
    search: (query: string) => dispatch(searchActions.search(query)),
    closeNotify: key => dispatch(notifyActions.closeNotify(key)),
    showNotify: (text, type) =>
      dispatch(
        notifyActions.enqueueSnackbar({
          message: text,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: type,
            action: key => (
              <Button onClick={() => dispatch(notifyActions.closeNotify(key))}>
                close
              </Button>
            )
          }
        })
      )
  })
)(Input);
