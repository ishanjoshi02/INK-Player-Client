import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import { connect } from "react-redux";
import { auth } from "../../actions";
import { Grid } from "@material-ui/core";
import PreviewVideo from "../PreviewVideo";
import { getWeb3 } from "../../utils/getWeb3";
import {
  LikedVideosAddress,
  VideoStoreAddress
} from "../../secrets/contract_addresses";
import JWT_SECRET from "../../secrets/jwt_secret";
const LikedVideosArtifact = require("../../contracts/LikedVideos.json");
const jwt = require("jsonwebtoken");
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

const LikedVideosStore = TruffleContract(LikedVideosArtifact);

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
};

class LikedVideos extends Component {
  constructor(props) {
    super(props);
    this.state = { ids: [] };
  }
  componentWillMount() {
    this.props.dispatch(auth());
  }
  componentWillReceiveProps(nextProps) {
    const { isAuth } = nextProps.user;
    if (isAuth) {
      const email = jwt.decode(readCookie(`token`), JWT_SECRET);
      console.log(email);
      this.getLikedVideos(email);
    }
  }
  getLikedVideos = async email => {
    let ids = [];
    const web3 = await getWeb3();
    LikedVideosStore.setProvider(web3.currentProvider);
    VideoStore.setProvider(web3.currentProvider);
    const vidInstance = await VideoStore.at(VideoStoreAddress);
    const instance = await LikedVideosStore.at(LikedVideosAddress);
    const account = await web3.eth.getAccounts()[0];
    const count = await vidInstance.getVideoCount.call({ from: account });
    for (let i = 0; i < count; i++) {
      if (await instance.isLiked.call(email, i, { from: account })) {
        ids.push(i);
      }
    }
    this.setState({ ids });
  };
  render() {
    return (
      <div>
        <Grid
          container
          spacing={8}
          style={{ paddingLeft: "7%", paddingTop: "2%" }}
        >
          {this.state.ids.map((id, i) => {
            if (id != 0) {
              return <PreviewVideo id={id} history={this.props.history} />;
            }
          })}
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LikedVideos);
