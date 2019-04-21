import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import {
  withStyles,
  Card,
  CardContent,
  Select,
  MenuItem,
  CardActions,
  CardMedia,
  Chip,
  LinearProgress
} from "@material-ui/core";
import JWT_SECRET from "../../secrets/jwt_secret";

// CSS
import styles from "./styles";
import { getWeb3 } from "../../utils/getWeb3";

// const IPFS = require("ipfs");
// const node = new IPFS();
const ipfsClient = require("ipfs-http-client");
const node = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
// const node = ipfsClient("localhost", "5001");
console.log(node);
const Web3 = require("web3");
const web3 = getWeb3();
const VideoStoreArtifact = require("../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);
const jwt = require("jsonwebtoken");
const fs = require("fs");
class UploadVideo extends Component {
  state = {
    title: "",
    description: "",
    category: "",
    file: null,
    uploading: false,
    percentUploaded: 0,
    ipfsHash: "",
    filePath: null
  };

  readCookie = name => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };
  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };
  handleCategoryChange = e => {
    this.setState({ category: e.target.value });
  };
  handleFileChange = e => {
    console.log(e.target);
    const file = e.target.files[0];
    this.setState({ file });
    this.setState({ filePath: URL.createObjectURL(e.target.files[0]) });
    console.log(this.state.filePath);
  };

  renderCategoriesOptions = () => {
    const categories = [
      "Music",
      "Gaming",
      "Trailer",
      "Vlogs",
      "Advertisement",
      "Other"
    ];

    return categories.map((item, i) => (
      <MenuItem key={i} value={item}>
        {item}
      </MenuItem>
    ));
  };

  renderFilePreview = () => {
    const { classes } = this.props;
    return this.state.file ? (
      <CardMedia
        component="video"
        controls
        style={{ height: "560px", background: "#000000" }}
        className={classes.media}
        src={URL.createObjectURL(this.state.file)}
        title={this.state.file.name}
      />
    ) : null;
  };

  setProgressBar = chunks => {
    console.log(chunks);
    this.setState({
      percentUploaded: Math.floor((chunks / this.state.file.size) * 100)
    });
  };

  submitVideo = e => {
    const { file } = this.state;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = e => {
      const { result } = e.target;
      const buffer = Buffer.from(result);
      this.setState({ uploading: true });
      node.add(
        {
          path: this.state.filePath,
          content: buffer
        },
        { progress: this.setProgressBar },
        async (err, files) => {
          if (err) {
            console.log(`Error while uploading \n${err}`);
          } else {
            const { hash } = files[0];
            // VideoStore.setProvider(web3.currentProvider);
            // const instance = await VideoStore.deployed();
            // const web3 = new Web3(window.web3.currentProvider);
            const web3 = await getWeb3();
            VideoStore.setProvider(web3.currentProvider);
            const instance = await VideoStore.at(
              `0x90154d3e6bcf0eb951b501eca479c1224fb125c6`
            );
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            const email = jwt.decode(this.readCookie(`token`), JWT_SECRET);
            console.log(`Your email is: ${email}`);
            const { title, description, category } = this.state;
            await instance.addVideo(
              title,
              description,
              hash,
              "tags",
              category,
              email,
              { from: accounts[0] }
            );
            const count = (await instance.getVideoListCount.call({
              from: accounts[0]
            })).toNumber();
            console.log(`Videos on Blockchain are ${count}`);
            console.log(this.props.history.push(`/view/${count}`));
          }
        }
      );
    };
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="container-fluid" style={{ padding: "5%" }}>
        <Card className={classes.card} style={{ width: "70%" }}>
          <CardContent>
            <form>
              <fieldset>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Title"
                    type="text"
                    onChange={this.handleTitleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Description"
                    type="text"
                    onChange={this.handleDescriptionChange}
                  />
                </div>
                <Select
                  style={{ minWidth: 120, width: "auto" }}
                  value={this.state.category}
                  onChange={this.handleCategoryChange}
                >
                  {this.renderCategoriesOptions()}
                </Select>
              </fieldset>
            </form>
          </CardContent>
          {this.renderFilePreview()}
          <CardActions>
            <label
              className={
                !this.state.uploading
                  ? "btn btn-primary"
                  : "btn btn-primary disabled"
              }
              htmlFor="video_file_input"
            >
              {this.state.file ? this.state.file.name : `Select File`}
            </label>
            <input
              disabled={this.state.uploading}
              onChange={this.handleFileChange}
              style={{ display: "none" }}
              accept="video"
              id="video_file_input"
              type="file"
            />
            <div
              style={
                this.state.file && this.state.file.size > 0
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <button
                className="btn btn-primary"
                disabled={this.state.uploading}
                onClick={this.submitVideo}
              >
                Upload
              </button>
            </div>
          </CardActions>{" "}
          <div
            style={
              this.state.percentUploaded !== 0
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <center>
              <Chip
                style={{ marginBottom: "5px" }}
                label={`${this.state.percentUploaded}%`}
                color="primary"
              />
            </center>
            <LinearProgress
              variant="determinate"
              value={this.state.percentUploaded}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(UploadVideo);
