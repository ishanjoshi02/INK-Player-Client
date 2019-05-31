import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import JWT_SECRET from "../../secrets/jwt_secret";
import { PlaylistAddress } from "../../secrets/contract_addresses";
import { getWeb3, getAccounts } from "../../utils/getWeb3";
const PlaylistArtifact = require("../../contracts/Playlist.json");

const PlaylistStore = TruffleContract(PlaylistArtifact);

const jwt = require("jsonwebtoken");

class CreatePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }
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
  handleChange = e => {
    this.setState({
      name: e.target.value
    });
  };
  onSubmit = async e => {
    e.preventDefault();
    const web3 = await getWeb3();
    console.log(web3);
    const email = jwt.decode(this.readCookie(`token`), JWT_SECRET);
    const account = await getAccounts(web3)[0];
    PlaylistStore.setProvider(web3.currentProvider);
    console.log(account);
    const instance = await PlaylistStore.at(PlaylistAddress);
    instance.createPlaylist(this.state.name, email, {
      from: `0xF71B925dAb68B0Cc2412aFa52C32c0d218Ed2E3a`
    });
  };
  render() {
    return (
      <div>
        {" "}
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            onChange={this.handleChange}
            placeholder="Playlist Name"
            value={this.state.name}
          />
          <button role="submit">Create</button>
        </form>
      </div>
    );
  }
}

export default CreatePlaylist;
