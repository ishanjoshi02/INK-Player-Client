import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import { getWeb3 } from "../../utils/getWeb3.js";
const Web3 = require("web3");
const UserStoreArtifact = require("../../contracts/UserStore.json");
const UserStore = TruffleContract(UserStoreArtifact);

class ViewUser extends Component {
  state = {
    name: "",
    username: "",
    email: ""
  };
  componentWillMount = async () => {
    const { email } = this.props.match.params;
    const web3 = await getWeb3();
    UserStore.setProvider(web3.currentProvider);
    UserStore.at(`0x7da7cf1016ddd07a43818dc7f0ba4ea3f65eccd3`).then(ins => {
      web3.eth.getAccounts().then(acc => {
        ins.getUser
          .call(email, {
            from: acc[0]
          })
          .then(res => {
            const { name, username, email } = res;
            this.setState({ name, username, email });
          });
      });
    });
  };
  render() {
    return <div>User Profile</div>;
  }
}

export default ViewUser;
