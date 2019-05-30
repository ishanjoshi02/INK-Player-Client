import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../../actions";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
class Login extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };
  onChange = e => {
    const { name, value } = e.target;
    switch (name) {
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
    this.props.dispatch(login(this.state));
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.user.error) {
      this.setState({ error: nextProps.user.login.error.message });
    } else {
      this.props.history.push("/");
    }
  };
  renderError() {
    if (this.state.error) {
      return (
        <div
          style={{
            marginTop: `10px`
          }}
          className="alert alert-disimmissable alert-danger"
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
            Sign in
          </Typography>

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
            Log in
          </Button>
          <p
            style={{
              marginTop: "10px"
            }}
          >
            <Link to="/signup" className={classes.create}>
              Create account
            </Link>
          </p>
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

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(Login));
