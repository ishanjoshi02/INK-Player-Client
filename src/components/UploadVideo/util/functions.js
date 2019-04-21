// Write all Util functions in this file

import TruffleContract from "truffle-contract";
const Web3 = require(web3);
const VideoStoreArtifact = require("../../../contracts/VideoStore.json");
const VideoStore = TruffleContract(VideoStoreArtifact);
const web3 = new Web3(
  new Web3.providers.HttpProvider(`http://localhost:${7545}`)
);

// Add metadata to Ethereum Blockchain function
export async function addVideoToBC({
  title,
  description,
  hash,
  tags,
  category
}) {
  const instance = await VideoStore.deployed();
}

// Upload function
