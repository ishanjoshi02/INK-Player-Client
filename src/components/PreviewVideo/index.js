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
import { VideoStoreAddress } from "../../secrets/contract_addresses";
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);
const Web3 = require("web3");

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  card: {
    width: 350,
    maxWidth: 400,
    height: 350
  },
  media: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "fill"
  }
});

class PreviewVideo extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", category: "", hash: "", id: null };
  }
  componentDidMount = async () => {
    const { id } = this.props;
    console.log(id);

    this.setState({ id });
    const web3 = new Web3(window.web3.currentProvider);
    VideoStore.setProvider(web3.currentProvider);
    const instance = await VideoStore.at(VideoStoreAddress);

    const vidInfo = await instance.getVideo.call(id);
    console.log(vidInfo);
    const { category, title, hash } = vidInfo;
    this.setState({ category, title, hash });
  };

  redirectToView = () => {
    this.props.history.push(`/view/${this.props.id}`);
  };

  render() {
    console.log(this.state.title);
    const { classes, category } = this.props;
    if (category) {
      if (this.state.category === category && this.state.id != 0) {
        return (
          <Grid key={this.props.id} style={{ margin: 5 }}>
            <Card onClick={this.redirectToView} className={classes.card}>
              <CardActionArea>
                <CardMedia
                  component="video"
                  className={classes.media}
                  src={`http://localhost:8080/ipfs/${this.state.hash}`}
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
                className={classes.media}
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
