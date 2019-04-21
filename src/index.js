import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

import Routes from "./Routes";
import store from "./store";

// CSS
import "./App.css";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>,

  document.getElementById("root")
);
serviceWorker.register();
