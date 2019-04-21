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
    audio: false
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
  }

  componentWillReceiveProps = nextProps => {
    const { audio } = nextProps;
    this.setState({ audio });
  };

  toggleMode = () => {
    this.props.dispatch(toggleMode());
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
                  <audio controls>
                    <source
                      src={`https://ipfs.io/ipfs/${this.state.vidHash}`}
                    />
                  </audio>
                ) : (
                  <ReactPlayer
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
  console.log(state);
  return {
    audio: state.videos.audio
  };
};

export default connect(mapStateToProps)(withStyles(styles)(View));
