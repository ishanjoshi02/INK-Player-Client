import React from "react";
import Header from "../widgets/Header";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import styles from "./styles";

const Layout = ({ children, classes, history }) => {
  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.content} style={{ paddingTop: `95px` }}>
        {children}
      </div>
    </div>
  );
};

Layout.protoTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Layout);
