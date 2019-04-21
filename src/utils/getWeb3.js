import Web3 from "web3";
import initContract from "truffle-contract";

const resolveWeb3 = resolve => {
  let { web3 } = window;
  let provider;
  if (typeof web3 !== "undefined") {
    console.log("Injected web3");
    provider = web3.currentProvider;
  } else {
    console.log("Local web3");
    provider = new Web3.providers.HttpProvider(`http://127.0.0.1:7545`);
  }
  web3 = new Web3(provider);
  resolve(web3);
};

export function getWeb3() {
  return new Promise(resolve => {
    window.addEventListener("load", () => {
      resolveWeb3(resolve);
    });
    if (document.readyState === "complete") {
      resolveWeb3(resolve);
    }
  });
}

export function getAccounts(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, accounts) =>
      error ? reject(error) : resolve(accounts)
    );
  });
}

export function getBalance(web3, account) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(account, (error, balance) =>
      error ? reject(error) : resolve(balance)
    );
  });
}

export async function getContract(web3, contractDefinition) {
  const contract = initContract(contractDefinition);
  contract.setProvider(web3.currentProvider);

  // Dirty hack for web3@1.0.0 support for localhost testrpc
  // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
  if (typeof contract.currentProvider.sendAsync !== "function") {
    contract.currentProvider.sendAsync = function() {
      return contract.currentProvider.send.apply(
        contract.currentProvider,
        arguments
      );
    };
  }

  const instance = await contract.deployed();
  return instance;
}

export function syncDefaultAccount(currentAccount, cb = () => {}) {
  return setInterval(function() {
    if (currentAccount.toLowerCase() !== window.web3.eth.defaultAccount) {
      currentAccount = window.web3.eth.defaultAccount;
      cb();
    }
  }, 100);
}

export function sendTransaction(web3, data, cb = () => {}) {
  const { _to, _eth } = data;
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(
      {
        from: window.web3.eth.defaultAccount,
        to: _to,
        value: _eth * 1e18
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });
}

export async function getTransactionsByAccount(web3, account) {
  const endBlockNumber = await new Promise((resolve, reject) =>
    web3.eth.getBlockNumber((error, result) =>
      error ? reject(error) : resolve(result)
    )
  );
  const startBlockNumber = endBlockNumber - 100;
  const promises = [];
  for (let i = startBlockNumber; i <= endBlockNumber; i++) {
    promises.push(
      new Promise((resolve, reject) =>
        web3.eth.getBlock(i, (error, result) =>
          error ? reject(error) : resolve(result)
        )
      )
    );
  }
  const allBlocks = await Promise.all(promises);
  const blocksWithTX = allBlocks.filter(
    block => block != null && block.transactions.length > 0
  );
  const TxIDs = blocksWithTX.map(block => block.transactions.pop());
  const TXs = await Promise.all(
    TxIDs.map(
      TX =>
        new Promise((resolve, reject) =>
          web3.eth.getTransaction(TX, (error, result) =>
            error ? reject(error) : resolve(result)
          )
        )
    )
  );
  return TXs.filter(tx => {
    if (account === "*" || tx.from === account || tx.to === account) {
      return tx;
    }
    return false;
  }).reverse();
}
