import React from "react";
import { Route, Switch } from "react-router-dom";
import Add from "./Add";
import Note from "./Note";

const NoteRoot = () => {
  return (
    <Switch>
      <Route path="/book/:name/note/add" component={Add} />
      <Route path="/book/:name/note/:hash" component={Note} />
    </Switch>
  );
};
export default NoteRoot;
