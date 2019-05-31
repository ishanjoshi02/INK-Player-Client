import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MoreIcon from "@material-ui/icons/MoreVert";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

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

class Header extends React.Component {
  state = {
    anchorEl: null,
    q: "",
    mobileMoreAnchorEl: null
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleQueryChange = e => {
    this.setState({ q: e.target.value });
  };

  search = () => {
    this.props.history.push(`/search/${this.state.q}`);
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <Link style={{ color: "#ffffff", textDecoration: "none" }} to="/">
          <MenuItem>
            <IconButton color="inherit">
              <HomeIcon />
            </IconButton>
            <p>Home</p>
          </MenuItem>
        </Link>

        <Link style={{ color: "#ffffff", textDecoration: "none" }} to="/upload">
          <MenuItem>
            <IconButton color="inherit">
              <CloudUploadIcon />
            </IconButton>
            <p>Upload</p>
          </MenuItem>
        </Link>
        <Link
          style={{ color: "#ffffff", textDecoration: "none" }}
          to="/profile"
        >
          <MenuItem onClick={this.handleProfileMenuOpen}>
            <IconButton color="inherit">
              <PersonIcon />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Link>
      </Menu>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <AppBar style={{ backgroundColor: theme.palette }} position="absolute">
          <Toolbar className="navbar navbar-expand-lg navbar-dark bg-dark">
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
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                onChange={this.handleQueryChange}
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    this.search();
                  }
                }}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
            <div className={classes.sectionDesktop}>
              <Link style={{ color: "#ffffff", textDecoration: "none" }} to="/">
                <IconButton color="inherit">
                  <HomeIcon />
                </IconButton>
              </Link>
              <Link
                style={{ color: "#ffffff", textDecoration: "none" }}
                to="/upload"
              >
                <IconButton color="inherit">
                  <CloudUploadIcon />
                </IconButton>
              </Link>

              <Link
                style={{ color: "#ffffff", textDecoration: "none" }}
                to="/profile"
              >
                <IconButton color="inherit">
                  <PersonIcon />
                </IconButton>
              </Link>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
            <AuthButton />
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </MuiThemeProvider>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(withRouter(Header));
