import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Button, Typography } from "@material-ui/core";
import TruffleContract from "truffle-contract";
import { Link } from "react-router-dom";

import {
  VideoStoreAddress,
  UserStoreAddress
} from "../../secrets/contract_addresses";

import styles from "./styles";
import { getWeb3 } from "../../utils/getWeb3";

const Web3 = require("web3");
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(`http://localhost:${7545}`)
// );
const web3 = new Web3(window.web3.currentProvider);
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

const UserStoreArtifact = require("../../contracts/UserStore.json");
const UserStore = TruffleContract(UserStoreArtifact);

class Profile extends Component {
  state = {
    password: "",
    subscribers: 0,
    vidCount: 0
  };

  getSubscribers = () => {
    UserStore.setProvider(web3.currentProvider);
    UserStore.at(UserStoreAddress).then(instance => {
      getWeb3().then(async accounts => {
        const account = accounts[0];
        const res = await instance.getSubscriberCount(this.props.email, {
          from: account
        });
        this.setState({ subscribers: res.toNumber() });
      });
    });
  };

  retVidCound = () => {
    VideoStore.setProvider(web3.currentProvider);
    VideoStore.at(VideoStoreAddress).then(vidInst => {
      web3.eth.getAccounts().then(accInst => {
        vidInst.getVideosByUser
          .call(this.props.email, {
            from: accInst[0]
          })
          .then(
            res => {
              this.setState({ videoCount: res.length });
            },
            err => {
              console.log(err);
            }
          );
      });
    });
  };

  changeCount = videoCount => {
    this.setState({
      vidCount: videoCount
    });
  };

  componentDidMount() {
    this.retVidCound();
    this.getSubscribers();
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textPrimary"
            gutterBottom
          >
            {this.props.name}
          </Typography>
          <Typography variant="h5" component="h2" />
          <Typography className={classes.pos} color="textPrimary">
            Email: {this.props.email}
          </Typography>
          <Typography className={classes.pos} component="p">
            No. of videos uploaded: {this.state.vidCount}
          </Typography>
          <Typography className={classes.pos} component="p">
            No. of subscribers: {this.state.subscribers}
          </Typography>
          <Link to="/edit">
            <Button
              variant="contained"
              color="primary"
              className={classes.editButton}
            >
              Edit Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
