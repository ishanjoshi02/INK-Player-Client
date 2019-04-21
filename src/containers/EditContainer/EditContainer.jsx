import React, { Component } from "react";
import { connect } from "react-redux";
import Edit from "../../components/EditProfile/Edit";
class EditContainer extends Component {
  componentDidMount() {}
  render() {
    const { email, username, name } = this.props.user;
    console.log(this.props.user);
    return (
      <React.Fragment>
        <Edit email={email} username={username} name={name} />
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

export default connect(mapStateToProps)(EditContainer);
