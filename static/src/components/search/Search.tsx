import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import { IAppState } from "../../reducers";
import Button from "@material-ui/core/Button";
import { ISearch } from "../../reducers/search";
import { List as PreloaderList } from "react-content-loader/";
import Paper from "@material-ui/core/Paper";
import { History } from "history";
import ResultsTable from "./Table";
import Typography from "@material-ui/core/Typography";
import { ITheme } from "../../reducers/theme";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";

import * as searchActions from "../../actions/search";
import * as notifyActions from "../../actions/notify";

const styles = createStyles((theme: Theme) => ({
  header: {
    color: theme.palette.primary.contrastText
  },
  button: {
    margin: theme.spacing(1)
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  },
  noteFetch: {
    position: "absolute",
    right: theme.spacing(1)
  }
}));

interface MatchParams {
  match: any;
}

interface IPropsFromState {
  history: History;
  loading: boolean;
  results: any;
  classes: any;
  isFetching: boolean;
  theme: ITheme;
}

interface IPropsFromDispatch {
  search: (query: string) => void;
  showNotify: (text: string, type: string) => void;
  closeNotify: (key: any) => void;
}

type AllProps = IPropsFromState & IPropsFromDispatch & MatchParams;
class Search extends React.Component<AllProps> {
  componentDidMount() {
    // BAG! same queries whyle renders
    const query = this.props.match.params.query;
    this.props.search(query);
  }
  render() {
    const { classes } = this.props;
    console.log(this.props.results);
    const query = this.props.match.params.query;
    if (this.props.isFetching === true) {
      return (
        <PreloaderList
          primaryColor={
            this.props.theme.theme == "light" ? "#ffffff" : "#000000"
          }
        />
      );
    } else {
      return (
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className={classes.header} style={{ alignSelf: "flex-start" }}>
              <strong>Search results for query: {query} </strong>
            </div>
            <div className={classes.header} style={{ marginLeft: "auto" }}>
              <strong>total: {this.props.results.length}</strong>
            </div>
          </div>
          <div>
            <Paper elevation={0}>
              <Breadcrumbs aria-label="Breadcrumb">
                <Link
                  color="inherit"
                  onClick={() => {
                    this.props.history.push("/");
                  }}
                >
                  Home
                </Link>
                <Link
                  color="inherit"
                  onClick={() => {
                    this.props.history.push("/");
                  }}
                >
                  Search
                </Link>
                <Typography color="textPrimary">{query}</Typography>
              </Breadcrumbs>
            </Paper>
          </div>
          <ResultsTable
            history={this.props.history}
            data={this.props.results}
          />
        </div>
      );
    }
  }
}

// ThunkDispatch<IAppState, null, AnyAction>
export default connect<any, any>(
  state => (state: IAppState) => ({
    results: state.searchState.results,
    isFetching: state.searchState.isFetching,
    theme: state.themeState
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
)(withStyles(styles)(Search));
