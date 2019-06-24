import React from "react";
import { Route, Switch } from "react-router-dom";
import draftsUploader from "./draftsUploader";

const DraftsRoot = () => {
  return (
    <Switch>
      <Route path="/draftsUploader" component={draftsUploader} />
    </Switch>
  );
};
export default DraftsRoot;
