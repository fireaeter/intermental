import React from "react";
import { Route, Switch } from "react-router-dom";
import Add from "./Add";
import Book from "./Book";
import Note from "../note/Note";
import { default as AddNote } from "../note/Add";
import Metaview from "./Metaview";

const BookRoot = () => {
  return (
    <Switch>
      <Route path="/book/add" component={Add} />
      <Route path="/book/:name/metaview" component={Metaview} />
      <Route path="/book/:name/note/add" component={AddNote} />
      <Route path="/book/:name/note/read/:hash" component={Note} />
      <Route path="/book/:name" component={Book} />
    </Switch>
  );
};
export default BookRoot;
