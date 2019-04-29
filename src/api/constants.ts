import { getStore } from "../redux";

export const testOpts = {
  node: {
    text: "OnyxChain Testnet",
    net: "TEST",
    address: "cepheus5.onyxpay.co"
  },
  head: { address: "9aa5af1bbb814daa6d8c48d7788ac75b3f389f41" },
  gasCompensator: {
    address: "http://cepheus-compensator.onyxpay.co:5001"
  },
  authApi: {
    address: "http://ec2-18-188-92-82.us-east-2.compute.amazonaws.com:7766/api/v1"
  },
  blockExplorer: {
    address: "http://cepheus-explorer.onyxpay.co/api/v1"
  }
};

export const propdOpts = {
  node: {
    text: "OnyxChain Mainnet",
    net: "MAIN",
    address: "https://andromeda-sync.onyxpay.co:8443"
  },
  head: { address: "34bef74a6ba72e2fdcecf2b3c67be9b26c70dac8" },
  gasCompensator: {
    address: "http://andromeda-compensator.onyxpay.co:8001"
  },
  authApi: {
    address: "https://ico.onyxcoin.io/api/v1"
  },
  blockExplorer: {
    address: "http://andromeda-explorer.onyxpay.co/api/v1"
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
