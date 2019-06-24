import React from "react";
import { IAppState } from "../../reducers";
import { withStyles } from "@material-ui/core/styles";
import { Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ReactQuill, { Quill } from "react-quill";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import "react-quill/dist/quill.snow.css";
import "./quill.css";

import { connect } from "react-redux";

import checkErrors from "../checkErrors";
import * as draftsActions from "../../actions/drafts";
import * as notifyActions from "../../actions/notify";
import * as notesActions from "../../actions/notes";

const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ],
    ["link", "image", "video"]
  ],
  clipboard: {
    matchVisual: false
  }
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video"
];

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
  }
}));

interface IPropsFromState {
  history: History;
  match: any;
  classes: any;
}
interface IPropsFromDispatch {
  showNotify: (message: string, Ntype: string) => void;
  closeNotify: (key) => void;
  addNote: (data) => void;
  addDraft: (draft: draftsActions.NewDraft) => void;
}

type AllProps = IPropsFromState & IPropsFromDispatch;

class Add extends React.Component<AllProps> {
  state = {
    header: "",
    content: "",
    book_password: "",
    errors: {
      header: false,
      book_password: false
    },
    dialogOpen: false
  };
  clearFields = () => {
    this.setState({
      header: "",
      content: "",
      errors: {}
    });
  };
  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      book_password: ""
    });
  };
  handleChange = (field: string, value) => {
    if (field === "header") {
      this.setState({
        header: value
      });
    }
    if (field === "book_password") {
      this.setState({
        book_password: value
      });
    }
  };
  handleNoteAdd = () => {
    if (this.state.book_password.length === 0) {
      this.setState({
        errors: {
          book_password: true
        }
      });
      this.props.showNotify("password field should not be empty", "error");
    } else {
      var data = {
        book_name: this.props.match.params.name,
        book_password: this.state.book_password,
        header: this.state.header,
        content: this.state.content
      };
      this.props.addNote(data);
    }
  };
  handleDraftAdd = () => {
    const formFieldsNames = ["header", "content"];
    const formFieldsDict = {
      header: this.state.header,
      content: this.state.content
    };
    var _checkErrors = checkErrors(formFieldsNames, formFieldsDict);
    if (_checkErrors.errors === true) {
      if (_checkErrors.errors_list["content"] == true) {
        document.documentElement.setAttribute("quillContentError", "true");
      } else {
        document.documentElement.setAttribute("quillContentError", "false");
      }
      this.setState({ errors: _checkErrors.errors_list });
      this.props.showNotify(_checkErrors.error_message, "error");
    } else {
      const draft: draftsActions.NewDraft = {
        book_name: this.props.match.params.name,
        header: this.state.header,
        content: this.state.content
      };
      this.setState({ errors: {} });
      document.documentElement.setAttribute("quillContentError", "false");
      this.props.addDraft(draft);
    }
  };
  handleQuillChange = (value: any) => {
    this.setState({
      content: value
    });
  };
  handleAdd = () => {
    const formFieldsNames = ["header", "content"];
    const formFieldsDict = {
      header: this.state.header,
      content: this.state.content
    };
    var _checkErrors = checkErrors(formFieldsNames, formFieldsDict);
    if (_checkErrors.errors === true) {
      if (_checkErrors.errors_list["content"] == true) {
        document.documentElement.setAttribute("quillContentError", "true");
      } else {
        document.documentElement.setAttribute("quillContentError", "false");
      }
      _checkErrors.errors_list["book_password"] = false;
      this.setState({ errors: _checkErrors.errors_list });
      this.props.showNotify(_checkErrors.error_message, "error");
    } else {
      document.documentElement.setAttribute("quillContentError", "false");
      this.setState({
        dialogOpen: true,
        errors: {}
      });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Password check</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add note to this book you should enter book password
            </DialogContentText>
            <TextField
              required
              error={this.state.errors["book_password"]}
              value={this.state.book_password}
              onChange={event => {
                this.handleChange("book_password", event.target.value);
              }}
              autoFocus
              margin="dense"
              id="name"
              label="password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.handleNoteAdd();
              }}
              color="primary"
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
        <Typography className={classes.header} variant="h4">
          Write new post
        </Typography>
        <TextField
          error={this.state.errors["header"]}
          required
          label="Header"
          placeholder="Note header"
          className={classes.textField}
          fullWidth
          value={this.state.header}
          onChange={event => {
            this.handleChange("header", event.target.value);
          }}
          margin="normal"
          variant="outlined"
        />
        {/* fix dark mode styles    */}
        <ReactQuill
          value={this.state.content}
          onChange={value => {
            this.handleQuillChange(value);
          }}
          placeholder="Note text"
          formats={quillFormats}
          modules={quillModules}
        />
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => {
              this.handleAdd();
            }}
            color="primary"
          >
            <AddIcon className={classes.leftIcon} />
            Add
          </Button>
          <Button
            onClick={() => {
              this.handleDraftAdd();
            }}
          >
            {/* <AddIcon className={classes.leftIcon} /> */}
            Save draft
          </Button>
          <Button
            onClick={() => {
              this.clearFields();
            }}
            color="secondary"
          >
            <DeleteIcon className={classes.leftIcon} />
            Clear
          </Button>
        </div>
      </div>
    );
  }
}

export default connect<any, any>(
  state => (state: IAppState) => ({
    book: state.bookState,
    notes: state.notesState
  }),
  dispatch => (dispatch: any): IPropsFromDispatch => ({
    closeNotify: key => dispatch(notifyActions.closeNotify(key)),
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
      ),
    addNote: data => dispatch(notesActions.addNote(data)),
    addDraft: (draft: draftsActions.NewDraft) =>
      dispatch(draftsActions.addDraft(draft))
  })
)(withStyles(styles)(Add));
