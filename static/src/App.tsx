import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SearchRoot from "./components/search/index";
import Home from "./components/home/Home";
import { History } from "history";
import Menu from "./components/menu";
import { Route, Switch } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { SnackbarProvider } from "notistack";
import Loading from "./components/menu/Loading";
import Typography from "@material-ui/core/Typography";
import CustomizedSnackbars from "./components/menu/Notify";
import BookRoot from "./components/book";
import DraftsRoot from "./components/draftsUploader";

import "./App.css";
import "./theme.css";
import "./styles.css";

interface IProps {
  history: History;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    },

    main: {
      marginBottom: theme.spacing(2)
    },
    footer: {
      background: theme.palette.background.default,
      padding: theme.spacing(2),
      marginTop: "auto",
      color: theme.palette.primary.contrastText
    },
    "@global": {
      body: {
        background: theme.palette.background.default
      }
    }
  })
);

const App: React.SFC<IProps> = (history: any) => {
  const classes = useStyles();
  return (
    <SnackbarProvider maxSnack={8}>
      <div className={classes.root}>
        <div className={classes.main}>
          <Grid container direction="row" justify="center">
            <Grid item xs={8}>
              <Menu history={history} />
              <Loading />
              <CustomizedSnackbars />
              <p />
              <Switch>
                <Route path="/book" component={BookRoot} />
                <Route path="/search" component={SearchRoot} />
                <Route path="/draftsUploader" component={DraftsRoot} />
                <Route exact path="/" component={Home} />
              </Switch>
            </Grid>
          </Grid>
        </div>
        <footer className={classes.footer}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography style={{ fontSize: "14px" }} variant="body1">
              <strong>Help</strong>|<strong>About</strong>
            </Typography>
            <Typography
              style={{ marginLeft: "auto", fontSize: "14px" }}
              variant="body1"
            >
              <strong>© 2019 intermental</strong>
            </Typography>
          </div>
        </footer>
      </div>
    </SnackbarProvider>
  );
};

export default App;
