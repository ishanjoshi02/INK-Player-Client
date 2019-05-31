import React, { Component } from "react";

import PreviewVideo from "../PreviewVideo";
import TruffleContract from "truffle-contract";
import { Grid } from "@material-ui/core";
import { getWeb3 } from "../../utils/getWeb3";
import getCategories from "../../utils/getCategories";
import { VideoStoreAddress } from "../../secrets/contract_addresses";
const Web3 = require("web3");
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { videos: [] };
  }
  componentWillMount = () => {
    this.getVideos().then(this.search);
  };
  getVideos = () => {
    return new Promise(async (resolve, reject) => {
      let videos = [];
      const web3 = await getWeb3();
      VideoStore.setProvider(web3.currentProvider);
      const instance = await VideoStore.at(VideoStoreAddress);
      const accounts = await web3.eth.getAccounts();
      const count = await instance.getVideoCount.call({ from: accounts[0] });
      for (let i = 0; i < count; i++) {
        let video = await instance.getVideo.call(i, { from: accounts[0] });
        videos.push({ i, ...video });
      }
      console.log(videos);
      resolve(videos);
    });
  };
  search = videos => {
    console.log("Searching");
    const { q } = this.props.match.params;

    let tempArray = [];

    const t2 = q.split(" ");

    for (let i = 0; i < videos.length; i++) {
      const t1 = videos[i].title.split(" ");
      if (this.jaccard(t1, t2)) {
        console.log(i);
        tempArray.push(videos[i]);
      }
    }
    console.log(tempArray);
    this.setState({ videos: tempArray });
  };

  // t1 = video title tokens.
  // t2 = query tokens
  jaccard = (t1, t2) => {
    const intersection = this.intersection(t1, t2);
    return (
      intersection.length / (t1.length + t2.length - intersection.length) >= 0.3
    );
  };

  intersection = (t1, t2) => {
    let intersect = [];
    for (let i = 0; i < t1.length; i++) {
      for (let j = 0; j < t2.length; j++) {
        console.log(t1[i]);
        if (
          (t1[i].toLowerCase() === t2[j].toLowerCase() ||
            t1[i].toLowerCase().includes(t2[j].toLowerCase())) &&
          intersect.indexOf(t1[i]) === -1
        ) {
          intersect.push(t1[i]);
        }
      }
    }
    console.log(intersect);
    return intersect;
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
          {this.state.videos.map((vid, i) => (
            <PreviewVideo id={vid.i} history={this.props.history} />
          ))}
        </Grid>
      </div>
    );
  }
}

export default Search;
