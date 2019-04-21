import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MenuIcon from "@material-ui/icons/Menu";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";

import MyDrawer from "./Drawer";

// CSS
import "./Header.css";
import styles from "./styles";
import AuthButton from "../AuthButton";

const Header = props => {
  const classes = props.classes;
  const [active, setActive] = useState(false);
  const closeDrawer = () => {
    setActive(false);
  };
  return (
    <div>
      <AppBar
        className={classNames(classes.appBar, active && classes.appBarShift)}
        position="absolute"
      >
        <Toolbar
          className="navbar navbar-expand-lg navbar-dark bg-primary"
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
            variant="title"
            color="inherit"
            noWrap
            className={classes.grow}
          >
            <Link style={{ color: "#ffffff", textDecoration: "none" }} to="/">
              Ink Player
            </Link>
          </Typography>
          <AuthButton />
        </Toolbar>
      </AppBar>
      <MyDrawer active={active} closeDrawer={closeDrawer} />
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Header);
