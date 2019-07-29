import { getStore } from "../redux";

export const testOpts = {
  node: {
    text: "OnyxChain Testnet",
    net: "TEST",
    address: "cepheus5.onyxpay.co",
    ssl: true
  },
  head: { address: "87fd9b3718308de50fd639c9b9a411835936766a" },
  gasCompensator: {
    address: "https://cepheus-compensator.onyxpay.co"
  },
  authApi: {
    address: "https://preprod.onyxcoin.io/api/v1/login"
  },
  blockExplorer: {
    address: "https://cepheus-explorer.onyxpay.co/api/v1"
  }
};

export const propdOpts = {
  node: {
    text: "OnyxChain Mainnet",
    net: "MAIN",
    address: "andromeda-sync.onyxpay.co",
    ssl: true
  },
  head: { address: "9a54f5d022fe964d32881a7ed8fe36795ec37c27" },
  gasCompensator: {
    address: "https://andromeda-compensator.onyxpay.co"
  },
  authApi: {
    address: "https://ico.onyxcoin.io/api/v1"
  },
  blockExplorer: {
    address: "https://andromeda-explorer.onyxpay.co/api/v1"
  }
};

function getNet() {
  const state = getStore().getState();
  return state.settings.net;
}

export function getOptions(net: string = getNet()) {
  if (net === "MAIN") {
    return propdOpts;
  } else {
    return testOpts;
  }
}
