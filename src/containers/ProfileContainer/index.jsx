import React, { Component } from "react";
import { connect } from "react-redux";
import Profile from "../../components/Profile";
class ProfileContainer extends Component {
  componentDidMount() {}
  render() {
    const { email, username, name } = this.props.user;
    return (
      <React.Fragment>
        <Profile email={email} username={username} name={name} />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  console.log(state);
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(ProfileContainer);
