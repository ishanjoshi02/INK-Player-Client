import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import { getWeb3 } from "../../utils/getWeb3.js";
// const Web3 = require("web3");

import {
  VideoStoreAddress,
  UserStoreAddress
} from "../../secrets/contract_addresses";

const UserStoreArtifact = require("../../contracts/UserStore.json");
const UserStore = TruffleContract(UserStoreArtifact);
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

class ViewUser extends Component {
  state = {
    name: "",
    username: "",
    email: "",
    videoCount: 0
  };
  componentWillMount = async () => {
    const { email } = this.props.match.params;
    const web3 = await getWeb3();
    UserStore.setProvider(web3.currentProvider);
    UserStore.at(UserStoreAddress).then(ins => {
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
    VideoStore.setProvider(web3.currentProvider);
    VideoStore.at(VideoStoreAddress).then(vidInst => {
      web3.eth.getAccounts().then(accInst => {
        vidInst.getVideosByUser
          .call(email, {
            from: accInst[0]
          })
          .then(
            res => {
              console.log(res);
              this.setState({ videoCount: res.length });
            },
            err => {
              console.log(err);
            }
          );
      });
    });
  };
  render() {
    return (
      <div>
        <h1>User Profile</h1>
        <br />
        <h2>Name: {this.state.name}</h2>
        <br />
        <h3>Username: {this.state.username}</h3>
        <br />
        <h3>Video Count: {this.state.videoCount}</h3>
      </div>
    );
  }
}

export default ViewUser;
