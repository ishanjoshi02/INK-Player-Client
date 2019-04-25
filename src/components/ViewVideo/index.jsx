import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  CardContent,
  Card,
  Button,
  CardMedia
} from "@material-ui/core/";
import { Link } from "react-router-dom";
import { getAudioStatus, toggleMode } from "../../actions";
import { connect } from "react-redux";

import styles from "./styles";

const Web3 = require("web3");
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);

const UserStoreArtifact = require("../../contracts/UserStore.json");
const UserStore = TruffleContract(UserStoreArtifact);

class View extends Component {
  state = {
    vidHash: "",
    title: "",
    firstVideo: false,
    description: "",
    username: "",
    audio: false,
    playing: false,
    uploaderEmail: "",
    time: 0
  };

  componentWillMount() {
    this.props.dispatch(getAudioStatus());
    const { audio } = this.props;
    this.setState({ audio });
  }

  getVidInfo = () => {
    try {
      const { id } = this.props.match.params;
      const web3 = new Web3(window.web3.currentProvider);
      VideoStore.setProvider(web3.currentProvider);
      VideoStore.at(`0x90154d3e6bcf0eb951b501eca479c1224fb125c6`).then(
        vidInst => {
          web3.eth.getAccounts().then(accInst => {
            vidInst.getVideo.call(id).then(
              res => {
                console.log(res);
                this.setData(res["hash"], res["title"], res["description"]);
                // this.setState({ username: res[7] });
                UserStore.setProvider(web3.currentProvider);
                UserStore.at(`0x7da7cf1016ddd07a43818dc7f0ba4ea3f65eccd3`).then(
                  async ins => {
                    const acc = await web3.eth.getAccounts();
                    ins
                      .getUser(res[7], {
                        from: acc[0]
                      })
                      .then(res => {
                        this.setState({ username: res.username });
                        this.setState({ uploaderEmail: res.email });
                      });
                  }
                );
              },
              err => {
                console.log(err);
              }
            );
          });
        }
      );
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
  }

  componentDidUpdate() {
    const { time } = this.state;
    if (time !== 0) {
      this.player.currentTime = time;
      this.player.play();
    }
  }

  componentWillReceiveProps = nextProps => {
    const { audio, time } = nextProps;
    this.setState({ audio, time });
  };

  toggleMode = () => {
    this.setState({ playing: true });
    this.props.dispatch(toggleMode(this.player.currentTime));
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
              <CardContent className={classes.content}>
                {this.state.audio ? (
                  <audio
                    ref={this.ref}
                    src={`https://ipfs.io/ipfs/${this.state.vidHash}`}
                    controls
                  />
                ) : (
                  <video
                    controls
                    style={{
                      width: "100%"
                    }}
                    ref={this.ref}
                    component="video"
                    src={`https://ipfs.io/ipfs/${this.state.vidHash}`}
                    title={this.state.title}
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
                    to={`/user/${this.state.uploaderEmail}`}
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
