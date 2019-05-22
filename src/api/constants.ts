import { getStore } from "../redux";

export const testOpts = {
  node: {
    text: "OnyxChain Testnet",
    net: "TEST",
    address: "cepheus5.onyxpay.co",
    ssl: true
  },
  head: { address: "9aa5af1bbb814daa6d8c48d7788ac75b3f389f41" },
  gasCompensator: {
    address: "https://cepheus-compensator.onyxpay.co"
  },
  authApi: {
    address: "https://preprod.onyxcoin.io/api/v1/login"
  },
  blockExplorer: {
    address: "http://18.202.221.73/api/v1"
  }
};

export const propdOpts = {
  node: {
    text: "OnyxChain Mainnet",
    net: "MAIN",
    address: "andromeda-sync.onyxpay.co",
    ssl: true
  },
  head: { address: "34bef74a6ba72e2fdcecf2b3c67be9b26c70dac8" },
  gasCompensator: {
    address: "https://andromeda-compensator.onyxpay.co"
  },
  authApi: {
    address: "https://ico.onyxcoin.io/api/v1"
  },
  blockExplorer: {
    address: "http://35.180.67.84/api/v1"
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
