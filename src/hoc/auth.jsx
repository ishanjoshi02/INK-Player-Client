import React, { Component } from "react";
import { auth } from "../actions";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";

export default (ComposedClass, reload) => {
  class AuthenticationCheck extends Component {
    state = { loading: true };
    componentWillMount = () => {
      this.props.dispatch(auth());
    };
    componentWillReceiveProps = nextProps => {
      this.setState({ loading: false });
      console.log(nextProps);
      if (!nextProps.user.isAuth) {
        this.props.history.push("/login");
      }
    };
    render() {
      return this.state.loading ? (
        <CircularProgress />
      ) : (
        <ComposedClass {...this.props} user={this.props.user} />
      );
    }
  }
  function mapStateToProps(state) {
    return {
      user: state.user
    };
  }
  return connect(mapStateToProps)(AuthenticationCheck);
};
