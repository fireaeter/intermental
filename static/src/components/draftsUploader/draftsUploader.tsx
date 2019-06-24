import React from "react";

import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import { IAppState } from "../../reducers";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { History } from "history";

import * as notesActions from "../../actions/notes";
import * as draftsActions from "../../actions/drafts";
import * as notifyActions from "../../actions/notify";
import getTree from "./maketree.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
interface IPropsFromState {
  history: History;
  drafts: any;
  classes: any;
}
interface IPropsFromDispatch {
  showNotify: (message: string, Ntype: string) => void;
  getAllDrafts: () => void;
  deleteDraft: (book: string, header: string) => void;
  closeNotify: (id) => void;
  addNote: (data) => void;
}

const styles = createStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  header: {
    color: theme.palette.primary.contrastText
  },
  text: {
    color: theme.palette.primary.contrastText
  },
  button: {
    margin: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

type AllTypes = IPropsFromState & IPropsFromDispatch;

class draftsUploader extends React.Component<AllTypes> {
  state = {
    asTree: false
  };
  componentDidMount() {
    this.props.getAllDrafts();
  }
  handleViewChange = () => {
    this.setState({
      asTree: !this.state.asTree
    });
  };
  render() {
    let drafts = this.props.drafts.drafts[0];
    console.log(drafts);
    let drafts_books = Object.keys(drafts);
    let _drafts = drafts_books.map(function(book) {
      return {
        book: book,
        drafts: drafts[book]
      };
    });
    let tree = getTree(drafts, 0);
    const { classes } = this.props;
    return (
      <div>
        <h2 className={classes.header}>Drafts uploader</h2>
        <FormControlLabel
          className={classes.text}
          control={
            <Switch
              checked={this.state.asTree}
              onChange={() => {
                this.handleViewChange();
              }}
              value="checkedA"
            />
          }
          label="View as tree"
        />
        {this.state.asTree ? (
          <p
            className={classes.text}
            style={{
              whiteSpace: "pre"
            }}
          >
            {""}
            {tree}
          </p>
        ) : (
          <div>
            {_drafts.map(item => {
              var removeDraft = (book: string, header) => {
                // alert("book " + book + " id " + id);
                this.props.deleteDraft(book, header);
              };
              var book = item["book"];
              var book_drafts = item["drafts"].map((draft, index) => {
                if (draft != null) {
                  return (
                    <div>
                      <p>
                        {draft["header"]}
                        <button
                          onClick={() => {
                            removeDraft(book, draft["header"]);
                          }}
                        >
                          remove
                        </button>
                      </p>
                    </div>
                  );
                }
              });
              return (
                <div>
                  <h2>{book}</h2>
                  <p style={{ marginLeft: 10 }}>{book_drafts}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  state => (state: IAppState) => ({
    drafts: state.draftsState
  }),
  dispatch => (dispatch: any): IPropsFromDispatch => ({
    addNote: data => dispatch(notesActions.addNote(data)),
    closeNotify: key => dispatch(notifyActions.closeNotify(key)),
    getAllDrafts: () => dispatch(draftsActions.getAllDrafts()),
    deleteDraft: (book: string, header: string) =>
      dispatch(draftsActions.deleteDraft(book, header)),
    showNotify: (text, type) =>
      dispatch(
        notifyActions.enqueueSnackbar({
          message: text,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: type,
            action: key => (
              <Button
                // color="secondary"
                onClick={() => dispatch(notifyActions.closeNotify(key))}
              >
                close
              </Button>
            )
          }
        })
      )
  })
)(withStyles(styles)(draftsUploader));
