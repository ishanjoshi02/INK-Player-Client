import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import { getWeb3 } from "../../utils/getWeb3.js";
// const Web3 = require("web3");
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
    VideoStore.setProvider(web3.currentProvider);
    VideoStore.at(`0x90154d3e6bcf0eb951b501eca479c1224fb125c6`).then(
      vidInst => {
        web3.eth.getAccounts().then(accInst => {
          vidInst.getVideosByUsers
            .call(email, {
              from: accInst[0]
            })
            .then(
              res => {
                this.setState({ videoCount: res["words"][0] });
              },
              err => {
                console.log(err);
              }
            );
        });
      }
    );
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
