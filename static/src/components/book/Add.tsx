import React from "react";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { History } from "history";

import checkErrors from "../checkErrors";
import * as notifyActions from "../../actions/notify";
import * as bookActions from "../../actions/book";

interface IPropsFromState {
  history: History;
}
interface IPropsFromDispatch {
  showNotify: (message: string, Ntype: string) => void;
  createBook: (data: bookActions.NewBook) => void;
  closeNotify: (id) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

interface ChipData {
  key: number;
  label: string;
}

interface State {
  name: string;
  password: string;
  description: string;
  author: string;
  keyword: string;
  keywords: string;
  errors: {};
  chips: [
    {
      key: number;
      label: string;
    }
  ];
}

type AllTypes = IPropsFromState & IPropsFromDispatch;

function Add(props: AllTypes) {
  const classes = useStyles();
  const [values, setValues] = React.useState<State>({
    name: "",
    password: "",
    description: "",
    author: "",
    keyword: "",
    keywords: "",
    errors: {
      name: false,
      password: false,
      description: false,
      author: false,
      keyword: false
    },
    chips: [{ key: 0, label: "" }]
  });

  function addChip(label: string) {
    var chipsData = values.chips;
    var chipData = {
      key: chipsData.length + 1,
      label: label
    };
    var chipsLabels = values.chips.map(item => {
      return item.label;
    });
    if (chipsLabels.includes(label) === false) {
      chipsData.push(chipData);
      setValues({ ...values, chips: chipsData, keywords: "" });
    } else {
      props.showNotify(
        "Keyword " + label + " is exists in keywords list",
        "error"
      );
      var errors = values.errors;
      errors["keyword"] = true;
      setValues({ ...values, errors: errors });
    }
  }

  const handleDelete = (data: ChipData) => () => {
    const chipToDelete = values.chips.indexOf(data);
    var chipsData = values.chips;
    chipsData.splice(chipToDelete, 1);
    setValues({ ...values, chips: chipsData });
  };

  const handleSubmit = () => {
    const formFieldsNames = ["name", "password", "author", "keyword"];
    const formFieldsDict = {
      name: values.name,
      password: values.password,
      author: values.author,
      description: values.description,
      keyword: values.keyword
    };
    var _checkErrors = checkErrors(formFieldsNames, formFieldsDict);
    if (_checkErrors.errors === true) {
      setValues({ ...values, errors: _checkErrors.errors_list });
      props.showNotify(_checkErrors.error_message, "error");
    } else {
      var keywords_string = "";
      values.chips.map(item => {
        if (item.key !== 0) {
          return (keywords_string += item.label + ";");
        } else {
          return (keywords_string += "");
        }
      });
      var book_data = {
        name: values.name,
        password: values.password,
        author: values.author,
        description: values.description,
        keywords: keywords_string
      };
      props.createBook(book_data);
      props.history.push("/book/" + values.name);
    }
  };

  const handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [name]: event.target.value });
  };
  return (
    <div>
      <Typography className={classes.header} variant="h4">
        Create new book
      </Typography>
      <Paper elevation={0}>
        <Breadcrumbs aria-label="Breadcrumb">
          <Link
            color="inherit"
            onClick={() => {
              props.history.push("/");
            }}
          >
            Home
          </Link>
          <Typography color="textPrimary">new book</Typography>
        </Breadcrumbs>
      </Paper>
      <TextField
        error={values.errors["name"]}
        required
        label="Name"
        placeholder="Book title"
        className={classes.textField}
        fullWidth
        value={values.name}
        onChange={handleChange("name")}
        margin="normal"
        variant="outlined"
      />
      <TextField
        error={values.errors["description"]}
        label="Description"
        placeholder="About book in a few words :)"
        className={classes.textField}
        fullWidth
        value={values.description}
        onChange={handleChange("description")}
        margin="normal"
        variant="outlined"
      />
      <TextField
        error={values.errors["password"]}
        required
        type="password"
        label="Password"
        placeholder="Book password"
        className={classes.textField}
        fullWidth
        value={values.password}
        onChange={handleChange("password")}
        margin="normal"
        variant="outlined"
      />
      <TextField
        error={values.errors["author"]}
        required
        label="Author's name"
        placeholder="Your name"
        className={classes.textField}
        fullWidth
        value={values.author}
        onChange={handleChange("author")}
        margin="normal"
        variant="outlined"
      />
      {/* <h5>Keywords</h5> */}
      {/* <p></p> */}
      <TextField
        style={{ width: "85%" }}
        error={values.errors["keyword"]}
        required
        label="Keyword"
        placeholder="Enter keyword"
        className={classes.textField}
        value={values.keyword}
        onChange={handleChange("keyword")}
        margin="normal"
        // variant="outlined"
      />
      <Button
        style={{ marginTop: "25px" }}
        onClick={() => {
          addChip(values.keyword);
        }}
        variant="outlined"
        color="primary"
        className={classes.button}
      >
        Add
      </Button>
      <br />
      {values.chips.map(data => {
        if (data.key !== 0) {
          return (
            <Chip
              key={data.key}
              label={data.label}
              onDelete={handleDelete(data)}
              className={classes.chip}
            />
          );
        } else {
          return null;
        }
      })}
      <Button
        onClick={() => {
          handleSubmit();
        }}
        fullWidth
        variant="contained"
        style={{ background: "blue", color: "white" }}
        className={classes.button}
      >
        Create!
        <SendIcon className={classes.rightIcon} />
      </Button>
    </div>
  );
}

// TODO переписать уведомления - генерировать options в action'e, тут передавать только message,type
// prettier-ignore
export default connect(
  state => ({}),
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
    createBook: (data: bookActions.NewBook) => dispatch(bookActions.createBook(data))
  })
)(Add);
