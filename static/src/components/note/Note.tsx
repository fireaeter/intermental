import React from "react";
import { List } from "react-content-loader";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NoteIcon from "@material-ui/icons/Note";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import { History } from "history";
import { connect } from "react-redux";
import { IAppState } from "../../reducers";
import { ITheme } from "../../reducers/theme";

import { Theme, createStyles, withStyles } from "@material-ui/core/styles";
import * as noteActions from "../../actions/note";
import "./note.css";

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

interface IPropsFromState {
  history: History;
  classes: any;
  note: any;
  match: any;
  theme: ITheme;
}
interface IPropsFromDispatch {
  getNote: (book_name: string, hash: string) => void;
}

type AllProps = IPropsFromState & IPropsFromDispatch;

class Note extends React.Component<AllProps> {
  componentDidMount() {
    let note_hash = this.props.match.params.hash;
    let book_name = this.props.match.params.name;
    this.props.getNote(book_name, note_hash);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.props.note.note == null || this.props.note.isFetching == true ? (
          <List
            primaryColor={
              this.props.theme.theme == "light" ? "#ffffff" : "#000000"
            }
          />
        ) : (
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={10}>
              <Paper style={{ minHeight: "80vh" }} className={classes.root}>
                <Button
                  onClick={() => {
                    this.props.history.push("/book/" + "/note/add");
                  }}
                  color="secondary"
                  className={classes.button}
                >
                  <BookmarkIcon className={classes.rightIcon} />
                  Add note to bookmarks
                </Button>
                <Typography variant="h4" component="h4">
                  {/* <NoteIcon fontSize="large" />{" "} */}
                  {this.props.match.params.name}
                </Typography>
                <br />
                <div className="noteContent">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.note.note["note"].content
                    }}
                  />
                </div>
                <br />
              </Paper>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

// prettier-ignore
export default connect<any, any>(
  state => (state: IAppState) => ({
    note: state.noteState,
    theme: state.themeState
  }),
  dispatch => (dispatch: any): IPropsFromDispatch => ({
    getNote: (book_name, hash: string) => dispatch(noteActions.getNote(book_name, hash))
  })
)(withStyles(styles)(Note));
