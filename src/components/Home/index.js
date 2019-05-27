import React from "react";
import { Grid } from "@material-ui/core";
import TruffleContract from "truffle-contract";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import PreviewVideo from "../PreviewVideo";
import { getWeb3 } from "../../utils/getWeb3";
import getCategories from "../../utils/getCategories";
import { VideoStoreAddress } from "../../secrets/contract_addresses";
const Web3 = require("web3");
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);
class Home extends React.Component {
  state = {
    ids: []
  };
  componentWillMount = async () => {
    const web3 = await getWeb3();
    VideoStore.setProvider(web3.currentProvider);
    const instance = await VideoStore.at(VideoStoreAddress);
    const accounts = await web3.eth.getAccounts();
    console.log(`Accounts`);
    console.log(accounts);
    const count = await instance.getVideoCount.call({ from: accounts[0] });
    console.log(count);
    let tempArray = [];
    for (let i = 1; i <= count; i++) tempArray.push(i);
    this.setState({ ids: tempArray });
  };
  getVideoInfo = async id => {
    const web3 = await getWeb3();
    VideoStore.setProvider(web3.currentProvider);
    const instance = await VideoStore.at(VideoStoreAddress);
    const accounts = await web3.eth.getAccounts();
    const vid = await instance.getVideo.call(id, { from: accounts[0] });
    return vid;
  };
  renderPreviews = () => {
    const categories = getCategories();
    console.log(categories);
    let component = null;
    component = categories.map(category => {
      return (
        /* <div key={category}> */
        <React.Fragment>
          {this.state.ids.map(id => (
            <PreviewVideo
              id={id}
              category={category}
              history={this.props.history}
            />
          ))}
        </React.Fragment>
        /* </div> */
      );
    });
    return component;
  };
  render() {
    return (
      <div>
        <Grid
          container
          spacing={8}
          style={{ paddingLeft: "7%", paddingTop: "2%" }}
        >
          {this.renderPreviews()}
        </Grid>
      </div>
    );
  }
}

export default Home;
