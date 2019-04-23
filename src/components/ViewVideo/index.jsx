import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  CardContent,
  CardActionArea,
  Card,
  Grid,
  Button,
  CardMedia
} from "@material-ui/core/";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { getAudioStatus, toggleMode } from "../../actions";
import { connect } from "react-redux";

import styles from "./styles";

const Web3 = require("web3");
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

class View extends Component {
  state = {
    vidHash: "",
    title: "",
    firstVideo: false,
    description: "",
    username: "",
    audio: false,
    playing: false,
    time: 0
  };

  componentWillMount() {
    console.log(this.props);
    this.props.dispatch(getAudioStatus());
    const { audio } = this.props;
    this.setState({ audio });
  }

  getVidInfo = () => {
    try {
      const { id } = this.props.match.params;
      const web3 = new Web3(window.web3.currentProvider);
      VideoStore.setProvider(web3.currentProvider);
      const instance = VideoStore.at(
        `0x90154d3e6bcf0eb951b501eca479c1224fb125c6`
      ).then(vidInst => {
        const accounts = web3.eth.getAccounts().then(accInst => {
          const vidInfo = vidInst.getVideo.call(id).then(
            res => {
              console.log(res);
              this.setData(res["hash"], res["title"], res["description"]);
              this.setState({ username: res[7] });
            },
            err => {
              console.log(err);
            }
          );
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  setData = (hash, title, description) => {
    this.setState({
      vidHash: hash,
      title: title,
      firstVideo: true,
      description: description
    });
  };

  componentDidMount() {
    this.getVidInfo();
    console.log(this.player);
  }

  componentDidUpdate() {
    console.log(this.player);
    const { time } = this.state;
    if (time !== 0) {
      if (this.state.audio) {
        this.player.currentTime = time;
        this.player.play();
      } else {
        this.player.seekTo(time, "seconds");
      }
    }
  }

  componentWillReceiveProps = nextProps => {
    const { audio, time } = nextProps;
    this.setState({ audio, time });
  };

  toggleMode = () => {
    // Get time from ref
    let time;
    if (this.state.audio) {
      time = this.player.currentTime;
    } else {
      time = this.player.getCurrentTime();
    }
    this.setState({ playing: true });
    this.props.dispatch(toggleMode(time));
  };

  ref = player => {
    this.player = player;
  };

  render() {
    const { classes } = this.props;
    const firstVideo = this.state.firstVideo;
    return (
      <div>
        {firstVideo ? (
          <React.Fragment>
            <Card className={classes.card}>
              <CardContent>
                {this.state.audio ? (
                  <audio
                    ref={this.ref}
                    src={`https://ipfs.io/ipfs/${this.state.vidHash}`}
                    controls
                  />
                ) : (
                  <ReactPlayer
                    ref={this.ref}
                    playing={this.state.playing}
                    url={`https://ipfs.io/ipfs/${this.state.vidHash}`}
                    controls={true}
                  />
                )}
                <Typography gutterBottom variant="h5" component="h2">
                  {this.state.title}
                </Typography>
                <Typography component="p">{this.state.description}</Typography>
                <Button
                  className={classes.buttonPos}
                  variant="contained"
                  color="secondary"
                  onClick={this.toggleMode}
                >
                  {this.state.audio ? `Video` : `Audio`}
                </Button>
                <Typography className={classes.uploader} component="p">
                  By:{" "}
                  <Link
                    to="/profile"
                    style={{ color: "#000", textDecoration: "none" }}
                  >
                    {this.state.username}
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </React.Fragment>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

View.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const { time, audio } = state.videos;
  return {
    time,
    audio
  };
};

export default connect(mapStateToProps)(withStyles(styles)(View));
