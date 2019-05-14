import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import FrontEnd from "layouts/FrontEnd.jsx";

import "assets/css/material-dashboard-react.css?v=1.6.0";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/" component={FrontEnd} />
      <Redirect from="/" to="/opportunities" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
