import { getStore } from "../redux";

export const testOpts = {
  node: {
    text: "OnyxChain Testnet",
    net: "TEST",
    address: "cepheus5.onyxpay.co"
  },
  head: { address: "9aa5af1bbb814daa6d8c48d7788ac75b3f389f41" },
  gasCompensator: {
    address: "http://3.120.190.178:5001"
  },
  authApi: {
    address: "http://ec2-18-188-92-82.us-east-2.compute.amazonaws.com:7766/api/v1"
  },
  blockExplorer: {
    address: "http://18.202.221.73/api/v1"
  }
};

export const propdOpts = {
  node: {
    text: "OnyxChain Mainnet",
    net: "MAIN",
    address: "andromeda1.onyxpay.co"
  },
  head: { address: "9aa5af1bbb814daa6d8c48d7788ac75b3f389f41" },
  gasCompensator: {
    address: "http://3.120.190.178:5001"
  },
  authApi: {
    address: "http://ec2-18-188-92-82.us-east-2.compute.amazonaws.com:7766/api/v1"
  },
  blockExplorer: {
    address: "http://18.202.221.73/api/v1"
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
