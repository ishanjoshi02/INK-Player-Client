import TruffleContract from "truffle-contract";
import JWT_SECRET from "../secrets/jwt_secret";
import { getWeb3 } from "../utils/getWeb3";
const UserStoreArtifact = require("../contracts/UserStore.json");
const UserStore = TruffleContract(UserStoreArtifact);
// const UserStore = artifacts.require("UserStore");
const jwt = require("jsonwebtoken");
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(`http://localhost:${7545}`)
// );
async function getUserStoreInstance() {
  const web3 = await getWeb3();
  UserStore.setProvider(web3.currentProvider);
  // return await UserStore.deployed().then(ins => {
  //   return ins;
  // });
  return await UserStore.at(`0x7da7cf1016ddd07a43818dc7f0ba4ea3f65eccd3`);
}
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
// Helper functions end
export async function auth() {
  const index = document.cookie.indexOf("token");
  if (index !== -1) {
    const email = jwt.decode(readCookie(`token`), JWT_SECRET);
    // get user details
    const ins = await getUserStoreInstance();
    const retVal = await ins.getUser.call(email);
    console.log(retVal);
    return {
      type: "USER_AUTH",
      payload: {
        index,
        email: retVal.email,
        address: retVal.addr,
        name: retVal.name,
        username: retVal.username
      }
    };
  }
  return {
    type: "USER_AUTH",
    payload: {
      index
    }
  };
}
export async function signup({
  email,
  password,
  username,
  firstname,
  lastname
}) {
  const web3 = await getWeb3();
  console.log(web3);
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  const ins = await getUserStoreInstance();
  const payload = await ins
    .createUser(email, username, firstname, lastname, password, {
      from: accounts[0]
    })
    .then(async res => {
      const retVal = await ins.getUser.call(email);
      return {
        email: retVal.email,
        address: retVal.addr,
        name: retVal.name,
        username: retVal.username,
        isAuth: true
      };
    })
    .catch(e => {
      return {
        email,
        account: accounts[0],
        isAuth: false,
        error: e
      };
    });
  return {
    type: "SIGNUP_USER",
    payload
  };
}
export async function login({ email, password }) {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  const ins = await getUserStoreInstance();
  const payload = ins
    .authenticateUser(email, password, {
      from: accounts[0]
    })
    .then(async res => {
      const retVal = await ins.getUser.call(email);
      return {
        email: retVal.email,
        address: retVal.addr,
        name: retVal.name,
        username: retVal.username,
        isAuth: true
      };
    })
    .catch(e => {
      return {
        email,
        account: accounts[0],
        isAuth: false,
        error: e
      };
    });
  return {
    type: "LOGIN_USER",
    payload
  };
}
export function getAudioStatus() {
  return {
    type: "AUDIO_STATUS"
  };
}
export function toggleMode() {
  return {
    type: "TOGGLE_MODE"
  };
}
