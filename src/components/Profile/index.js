import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Button, Typography } from "@material-ui/core";
import TruffleContract from "truffle-contract";
import { Link } from "react-router-dom";

import styles from "./styles";

const Web3 = require("web3");
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(`http://localhost:${7545}`)
// );
const web3 = new Web3(window.web3.currentProvider);
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

class Profile extends Component {
  state = {
    password: "",
    vidCount: 0
  };

  retVidCound = () => {
    VideoStore.setProvider(web3.currentProvider);
    const instance = VideoStore.at(
      `0x90154d3e6bcf0eb951b501eca479c1224fb125c6`
    ).then(vidInst => {
      const accounts = web3.eth.getAccounts().then(accInst => {
        const count = vidInst.getVideoListCount
          .call({
            from: accInst[0]
          })
          .then(
            res => {
              this.changeCount(res["words"][0]);
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
