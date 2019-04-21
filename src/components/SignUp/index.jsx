import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { signup } from "../../actions";

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
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <legend>Sign Up Form</legend>
            <div className="form-group ">
              <input
                id="firstName"
                type="text"
                className="form-control"
                value={this.state.firstname}
                placeholder="Enter your First Name"
                name="firstname"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={this.state.lastname}
                placeholder="Enter your Last Name"
                name="lastname"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={this.state.username}
                placeholder="Enter your Username"
                name="username"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                value={this.state.email}
                placeholder="Enter your Email"
                name="email"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                value={this.state.password}
                placeholder="Enter your Password"
                name="password"
                onChange={this.onChange}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Signup
            </button>
            <p
              style={{
                marginTop: "10px"
              }}
            >
              Already have an account,{" "}
              <Link to="/login">Click here to Login</Link>
            </p>
            <br />
            {this.renderError()}
          </fieldset>
        </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(SignUp);
