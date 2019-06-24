import React from "react";
import { Route, Switch } from "react-router-dom";
import Add from "../note/Add";

const NotesRoot = () => {
  return (
    <Switch>
      {/* <Route path='/book/add' component={Add} ></Route> */}
      <Route path="/book/:name/notes/add" component={Add} />
    </Switch>
  );
};
export default NotesRoot;
