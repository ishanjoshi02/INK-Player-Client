import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Card, CardContent, Button } from "@material-ui/core";
import TruffleContract from "truffle-contract";

import styles from "./styles";

const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(`http://localhost:${7545}`)
);
const UserStoreArtifact = require("../../contracts/UserStore.json");
const UserStore = TruffleContract(UserStoreArtifact);

class Edit extends Component {
  state = {
    firstname: this.props.name.split(" ")[0],
    lastname: this.props.name.split(" ")[1],
    username: this.props.username,
    email: this.props.email
  };

  //Changing input field
  handleChange = username => event => {
    this.setState({
      username: event.target.value
    });
  };

  changeUserName = () => {
    UserStore.setProvider(web3.currentProvider);
    const instance = UserStore.deployed().then(userInst => {
      const accounts = web3.eth.getAccounts().then(accInst => {
        //sendTransaction is used for writing, since data is modified in the blockchain
        userInst.changeUsername
          .sendTransaction(this.state.email, this.state.username, {
            from: accInst[0]
          })
          .then(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
          );
      });
    });
  };

  // The below 2 functions are used to update the data automatically
  // On removing these two, data won't update even after traversing between pages
  // A hard refresh i.e F5 is needed to udpate the data

  setThoseStates = (name, username, email) => {
    this.setState({
      firstname: name.split(" ")[0],
      lastname: name.split(" ")[1],
      username: username,
      email: this.props.email
    });
  };

  getUserData = () => {
    UserStore.setProvider(web3.currentProvider);
    const instance = UserStore.deployed().then(userInst => {
      const accounts = web3.eth.getAccounts().then(accInst => {
        //call is used for reading purposes
        userInst.getUser
          .call(this.state.email, {
            from: accInst[0]
          })
          .then(
            res => {
              this.setThoseStates(res["name"], res["username"], res["email"]);
            },
            err => {
              console.log(err);
            }
          );
      });
    });
  };

  //To update data on mounting component
  componentDidMount() {
    this.getUserData();
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="standard-name"
              label="First Name"
              className={classes.textField}
              value={this.state.firstname}
              margin="normal"
            />
            <TextField
              id="standard-name"
              label="Last Name"
              className={classes.textField}
              value={this.state.lastname}
              margin="normal"
            />
            <TextField
              id="standard-name"
              label="Username"
              className={classes.textField}
              value={this.state.username}
              onChange={this.handleChange("username")}
              margin="normal"
            />
            <TextField
              id="standard-name"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              onClick={this.changeUserName}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Edit);
