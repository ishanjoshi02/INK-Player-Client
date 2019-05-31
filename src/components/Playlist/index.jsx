import React, { Component } from "react";
import TruffleContract from "truffle-contract";
import JWT_SECRET from "../../secrets/jwt_secret";
import { PlaylistAddress } from "../../secrets/contract_addresses";
import { getWeb3 } from "../../utils/getWeb3";
const PlaylistArtifact = require("../../contracts/Playlist.json");

const PlaylistStore = TruffleContract(PlaylistArtifact);

const jwt = require("jsonwebtoken");
class PlaylistsView extends Component {
  constructor(props) {
    super(props);
    this.state = { playlists: [] };
  }

  componentWillMount() {
    this.getPlaylists();
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

  getPlaylists = async () => {
    let temp = [];
    const web3 = await getWeb3();
    const email = jwt.decode(this.readCookie(`token`), JWT_SECRET);
    const account = web3.eth.getAccounts()[0];
    PlaylistStore.setProvider(web3.currentProvider);
    const instance = await PlaylistStore.at(PlaylistAddress);
    const playlistCount = (await instance.getPlaylistListCount.call({
      from: account
    })).toNumber();
    console.log(playlistCount);
    for (let i = 0; i < playlistCount; i++) {
      const { ownerEmail, name } = await instance.getPlaylist.call(i, {
        from: account
      });
      if (ownerEmail === email) {
        temp.push({
          name,
          i
        });
      }
    }
    this.setState({ playlists: temp });
  };

  render() {
    return (
      <div>
        Playlists
        <br />
        {this.state.playlists.map((list, i) => (
          <div key={i}>{list.name}</div>
        ))}
      </div>
    );
  }
}

export default PlaylistsView;
