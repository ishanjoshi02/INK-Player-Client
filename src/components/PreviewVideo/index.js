import React, { Component } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography
} from "@material-ui/core";
import TruffleContract from "truffle-contract";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getWeb3 } from "../../utils/getWeb3";
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);
const Web3 = require("web3");
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  card: {
    maxWidth: 345,
    maxHeight: 500
  },
  media: {
    width: "100%"
  }
});
class PreviewVideo extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", category: "", hash: "" };
  }
  componentDidMount = async () => {
    const { id } = this.props;
    console.log(id);
    const web3 = new Web3(window.web3.currentProvider);
    VideoStore.setProvider(web3.currentProvider);
    const instance = VideoStore.at(
      `0x90154d3e6bcf0eb951b501eca479c1224fb125c6`
    ).then(vidInst => {
      const accounts = web3.eth.getAccounts().then(accInst => {
        const vidInfo = vidInst.getVideo.call(id).then(
          res => {
            console.log(res);
            const { category, title, hash } = res;
            this.setState({ category, title, hash });
          },
          err => {
            console.log(err);
          }
        );
      });
    });
  };
  redirectToView = () => {
    this.props.history.push(`/view/${this.props.id}`);
  };
  render() {
    const { classes, category } = this.props;
    if (category) {
      if (this.state.category === category) {
        return (
          <Grid key={this.props.id} style={{ margin: 5 }}>
            <Card onClick={this.redirectToView} className={classes.card}>
              <CardActionArea>
                <CardMedia
                  component="video"
                  classname={classes.media}
                  src={`https://ipfs.io/ipfs/${this.state.hash}`}
                />
              </CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  {this.state.title}
                </Typography>
                <Typography variant="subheading">
                  {this.state.category}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      } else {
        return null;
      }
    } else {
      return (
        <Grid key={this.props.id} style={{ margin: 5 }}>
          <Card onClick={this.redirectToView} className={classes.card}>
            <CardActionArea>
              <CardMedia
                component="video"
                classname={classes.media}
                src={`https://ipfs.io/ipfs/${this.state.hash}`}
              />
            </CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {this.state.title}
              </Typography>
              <Typography variant="subheading">
                {this.state.category}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  }
}
PreviewVideo.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(PreviewVideo);
