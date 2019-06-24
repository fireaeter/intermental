import React from "react";
import { Route, Switch } from "react-router-dom";
import Search from "./Search";

const SearchRoot = () => {
  return (
    <Switch>
      <Route path="/search/:query" component={Search} />
    </Switch>
  );
};
export default SearchRoot;
