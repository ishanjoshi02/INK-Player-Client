import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { signup } from "../../actions";

const styles = theme => ({
  card: {
    width: 350,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "100px",
    padding: "20px"
  },
  inkPlayer: {
    textAlign: "center",
    "&:hover": {
      color: "#1A73E8"
    }
  },
  login: {
    "&:hover": {
      textDecoration: "none"
    }
  },
  create: {
    "&:hover": {
      textDecoration: "none"
    }
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

class SignUp extends Component {
  state = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    error: ""
  };
  onChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case "firstname": {
        this.setState({ firstname: value });
        break;
      }
      case "lastname": {
        this.setState({ lastname: value });
        break;
      }
      case "username": {
        this.setState({ username: value });
        break;
      }
      case "email": {
        this.setState({ email: value });
        break;
      }
      case "password": {
        this.setState({ password: value });
        break;
      }
      default: {
        break;
      }
    }
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.dispatch(signup(this.state));
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.user.isAuth) {
      this.props.history.push("/");
    } else {
      try {
        this.setState({ error: nextProps.user.login.error.reason });
      } catch (e) {}
    }
  };
  renderError() {
    if (this.state.error) {
      return (
        <div
          style={{
            marginTop: `10px`
          }}
          className="alert alert-dismissible alert-danger"
        >
          {this.state.error}
        </div>
      );
    }
    return null;
  }
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <form onSubmit={this.onSubmit}>
          <Typography variant="h5" className={classes.inkPlayer}>
            INK Player
          </Typography>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "10px"
            }}
          >
            Create your account
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div className="form-group ">
                <TextField
                  style={{ marginRight: "10px" }}
                  id="outlined-email-input"
                  label="First Name"
                  type="text"
                  name="firstname"
                  margin="normal"
                  variant="outlined"
                  value={this.state.firstname}
                  onChange={this.onChange}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="form-group">
                <TextField
                  style={{ marginLeft: "10px" }}
                  id="outlined-email-input"
                  label="Last Name"
                  type="text"
                  name="lastname"
                  margin="normal"
                  variant="outlined"
                  value={this.state.lastname}
                  onChange={this.onChange}
                />
              </div>
            </Grid>
          </Grid>
          <div className="form-group">
            <TextField
              fullWidth
              id="outlined-email-input"
              label="Username"
              type="text"
              name="username"
              margin="normal"
              variant="outlined"
              value={this.state.usernamename}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              id="outlined-email-input"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              margin="normal"
              variant="outlined"
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              id="outlined-password-input"
              label="Password"
              name="password"
              type="password"
              margin="normal"
              variant="outlined"
              value={this.state.password}
              onChange={this.onChange}
            />
          </div>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#1A73E8",
              color: "#fff",
              float: "right"
            }}
            type="submit"
          >
            Sign Up
          </Button>
          <p
            style={{
              marginTop: "10px"
            }}
          >
            <Link to="/login" className={classes.login}>
              Login instead
            </Link>
          </p>
          <br />
          {this.renderError()}
        </form>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  };
};

SignUp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(SignUp));
