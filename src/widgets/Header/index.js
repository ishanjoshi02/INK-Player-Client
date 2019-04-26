import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MenuIcon from "@material-ui/icons/Menu";
import classNames from "classnames";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";

import MyDrawer from "./Drawer";

// CSS
import "./Header.css";
import styles from "./styles";
import AuthButton from "../AuthButton";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "dark"
  }
});

const Header = props => {
  const classes = props.classes;
  const [active, setActive] = useState(false);
  const closeDrawer = () => {
    setActive(false);
  };
  return (
    <MuiThemeProvider theme={theme}>
      <AppBar
        style={{ backgroundColor: theme.palette }}
        className={classNames(classes.appBar, active && classes.appBarShift)}
        position="absolute"
      >
        <Toolbar
          className="navbar navbar-expand-lg navbar-dark bg-dark"
          disableGutters={!active}
        >
          <IconButton
            style={{ textDecoration: "none" }}
            className={classNames(
              "App",
              classes.menuButton,
              active && classes.hide
            )}
            color="inherit"
            aria-label="Open Drawer"
            onClick={() => setActive(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.grow}
          >
            <Link style={{ color: "#ffffff", textDecoration: "none" }} to="/">
              INK Player
            </Link>
          </Typography>
          <AuthButton />
        </Toolbar>
      </AppBar>
      <MyDrawer active={active} closeDrawer={closeDrawer} />
    </MuiThemeProvider>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Header);
