import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  IconButton,
  List,
  Drawer,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FontAwesome from "react-fontawesome";

import styles from "./../styles";

const MyDrawer = ({ active, closeDrawer, classes, theme, history }) => {
  const navItems = [
    {
      icon: "home",
      link: "/",
      title: "Home"
    },
    {
      icon: "upload",
      link: "/upload",
      title: "Upload Video"
    },
    {
      icon: "user",
      link: "/profile",
      title: "Profile"
    }
  ];
  const renderNavItems = () =>
    navItems.map((item, i) => (
      <Link key={i} to={item.link} style={{ textDecoration: "none" }}>
        <ListItem
          style={{
            paddingLeft: "25px",
            paddingTop: "25px"
          }}
          button
          title={item.title}
        >
          <ListItemIcon>
            <FontAwesome size="2x" name={item.icon} />
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      </Link>
    ));
  const setIcon = () => {
    return theme.direction === "rtl" ? (
      <ChevronRightIcon />
    ) : (
      <ChevronLeftIcon />
    );
  };
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classNames(
          classes.drawerPaper,
          !active && classes.drawerPaperClose
        )
      }}
      open={active}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={() => closeDrawer()}>{setIcon()}</IconButton>
      </div>
      <List>{renderNavItems()}</List>
    </Drawer>
  );
};

Drawer.propTypes = {
  classes: PropTypes.object.isRequired
  //   theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MyDrawer);
