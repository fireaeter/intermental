import React from "react";
import { History } from "history";
import { Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import BookIcon from "@material-ui/icons/Book";
import List from "@material-ui/core/List";
import { List as PreloaderList } from "react-content-loader/";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import SyntaxHighlighter from "react-syntax-highlighter";
import Moment from "moment";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { withStyles, WithStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { IBook } from "../../reducers/book";
import { INote } from "../../reducers/notes";
import { IAppState } from "../../reducers";
import * as notifyActions from "../../actions/notify";
import * as bookActions from "../../actions/book";
import * as notesActions from "../../actions/notes";
import * as noteActions from "../../actions/note";
import { ITheme } from "../../reducers/theme";

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
  match: any;
  book: any;
  notes: INote[];
  theme: ITheme;
  note: any;
  loading: any;
  classes: any;
}
interface IPropsFromDispatch {
  showNotify: (message: string, Ntype: string) => void;
  closeNotify: (id) => void;
  getBook: (name: string) => void;
  getNotes: (book_name: string) => void;
  getNote: (book_name: string, hash: string) => void;
}

type AllProps = IPropsFromState & IPropsFromDispatch;
// TODO дергать сервер на пагинацию

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  classes: any;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        />
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

class Book extends React.Component<AllProps> {
  state = {
    dialogOpen: false,
    dialogHash: ""
  };
  componentDidMount() {
    let book_name = this.props.match.params.name;
    this.props.getBook(book_name);
    this.props.getNotes(book_name);
  }
  handleViewIpfsHashDialogOpen = (hash: string) => {
    let book_name = this.props.match.params.name;
    this.props.getNote(book_name, hash);
    this.setState({
      dialogOpen: true,
      dialogHash: hash
    });
  };
  handleDialogClose = () => {
    this.setState({
      dialogOpen: false
    });
  };
  render() {
    const { classes } = this.props;
    if (
      this.props.book["book"].length !== 0 &&
      this.props.book.isFetching == false
    ) {
      let book_name = this.props.match.params.name;
      let book = this.props.book["book"];
      let keywords = book["book"][0]["content"]["keywords"];
      let keywords_array = keywords.split(";");
      let created_date = Moment.unix(book.book[0].content.created).format(
        "DD/MM/YYYY"
      );
      let ipfsCommands =
        "$ ipfs daemon \n $ ipfs get {hash} \n $ ipfs cat {hash}";
      return (
        <div>
          <Dialog
            onClose={this.handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.dialogOpen}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={this.handleDialogClose}
            >
              <div className={classes.noteFetch}>
                <Fade
                  in={this.props.note.isFetching}
                  style={{
                    transitionDelay: this.props.note.isFetching
                      ? "800ms"
                      : "0ms"
                  }}
                  unmountOnExit
                >
                  <CircularProgress size={20} />
                </Fade>
              </div>
              Save/ Download note
            </DialogTitle>
            <DialogContent dividers>
              {this.props.note.note == null ? null : (
                <div>
                  The note ipfs hash:{" "}
                  <strong style={{ color: "teal" }}>
                    {this.props.note.note["ipfs_info"]["Hash"]}
                  </strong>
                  <br />
                  To save it run ipfs daemon(if not runned) and get note:
                  <SyntaxHighlighter
                    showLineNumbers={true}
                    language="bash"
                    style={this.props.theme.theme == "light" ? docco : dark}
                  >
                    {ipfsCommands}
                  </SyntaxHighlighter>
                  or click{" "}
                  <strong style={{ color: "red" }}>READ BOOK BY HASH</strong>{" "}
                  button in menu
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose} color="primary">
                ok
              </Button>
            </DialogActions>
          </Dialog>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={10}>
              <Paper style={{ minHeight: "80vh" }} className={classes.root}>
                <Grid
                  container
                  spacing={5}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={7}>
                    <Typography variant="h4" component="h4">
                      <BookIcon fontSize="large" />{" "}
                      {this.props.match.params.name}
                    </Typography>
                    <Typography variant="h6" component="p">
                      Author: {book["book"][0]["content"]["author"]}
                    </Typography>
                    Description: {book["book"][0]["content"]["description"]}
                    <br />
                    <div>
                      {keywords_array.map((item, index) => {
                        if (item.length !== 0) {
                          return (
                            <Chip
                              key={index}
                              label={item}
                              className={classes.chip}
                              component="a"
                              clickable
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      onClick={() => {
                        this.props.history.push(
                          "/book/" + book_name + "/note/add"
                        );
                      }}
                      color="secondary"
                      className={classes.button}
                    >
                      <AddIcon className={classes.rightIcon} />
                      Write note
                    </Button>
                    <br />
                    created: {created_date}
                    <br />
                    total notes: {book["notes"]["total"]}
                  </Grid>
                </Grid>
                <br />
                <ExpansionPanel
                  style={{
                    "::before": {
                      display: "none"
                    },
                    width: "100%",
                    WebkitBoxShadow: "none",
                    MozBoxShadow: "none",
                    boxShadow: "none"
                  }}
                >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      More info
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      ipfs path: {book["book"][0]["content"]["ipfs_path"]}
                      <br />
                      ipfs hash: {book["ipfs"]["Hash"]}
                      <br />
                      blockchain hash: {book["book"][0]["hash"]}
                      <br />
                      ipfs blocks: {book["ipfs"]["Blocks"]}
                      <br />
                      ipfs type: {book["ipfs"]["Type"]}
                      <br />
                      Cumulative size: {book["ipfs"]["CumulativeSize"]}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <strong
                  style={{
                    marginLeft: "35%",
                    fontSize: "1.5em"
                  }}
                >
                  Table of contents
                </strong>
                <List component="nav">
                  {this.props.notes["notes"].map((item, index) => {
                    let item_name = "";
                    let route_redirect_path = "";
                    let button;
                    if (index === 0) {
                      route_redirect_path = "/book/" + book_name + "/metaview";
                      item_name = "Meta block";
                    } else {
                      //prettier-ignore
                      route_redirect_path = "/book/" + book_name + "/note/read/" + item.hash;
                      item_name = JSON.parse(item["content"])["header"];
                      button = (
                        <Button
                          onClick={() => {
                            this.handleViewIpfsHashDialogOpen(item["hash"]);
                          }}
                          color="secondary"
                        >
                          Get IPFS hash
                        </Button>
                      );
                    }
                    return (
                      <ListItem
                        onClick={() => {
                          this.props.history.push(route_redirect_path);
                        }}
                        key={index}
                        button
                      >
                        <ListItemText primary={item_name} />
                        <ListItemSecondaryAction>
                          {button}
                          page {index + 1}
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Tooltip title="Write note to the book" aria-label="Add">
            <Fab
              onClick={() => {
                this.props.history.push("/book/" + book_name + "/note/add");
              }}
              className={classes.fab}
              color="secondary"
            >
              <AddIcon style={{ color: "white" }} />
            </Fab>
          </Tooltip>
        </div>
      );
    }
    if (
      this.props.book.isFetching == true ||
      this.props.book["book"].length == 0
    ) {
      return (
        <PreloaderList
          primaryColor={
            this.props.theme.theme == "light" ? "#ffffff" : "#000000"
          }
        />
      );
    }
  }
}

// prettier-ignore
export default connect<any, any>(
  state => (state: IAppState) => ({
    loading: state.loadingState,
    book: state.bookState,
    notes: state.notesState,
    note: state.noteState,
    theme: state.themeState
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
              <Button onClick={() => dispatch(notifyActions.closeNotify(key))}>
                close
              </Button>
            )
          }
        })
      ),
    getBook: (name: string) => dispatch(bookActions.getBook(name)),
    getNotes: (book_name: string) => dispatch(notesActions.getNotes(book_name)),
    getNote: (book_name: string, hash: string) => dispatch(noteActions.getNote(book_name, hash))
  })
)(withStyles(styles)(Book));
