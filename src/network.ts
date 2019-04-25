import { CONST, WebsocketClient } from "ontology-ts-sdk";
import { testOpts, propdOpts } from "./api/constants";
import { changeNetworkState } from "./redux/status/statusActions";
import { SettingsState, compareSettings } from "./redux/settings/settingsReducer";
import { GlobalStore } from "./redux";

export let client: WebsocketClient;
let settings: SettingsState | null = null;

export function initNetwork(store: GlobalStore) {
  store.subscribe(() => {
    const state = store.getState();
    const newSettings = state.settings;

    if (!compareSettings(settings, newSettings)) {
      settings = newSettings;

      reconnect(newSettings);
    }
  });

  store.dispatch(changeNetworkState("CONNECTED"));

  window.setInterval(async () => {
    try {
      await client.sendHeartBeat();
      // TODO: check prev state before dispatch
      store.dispatch(changeNetworkState("CONNECTED"));
    } catch (e) {
      console.log(e);
      if (settings != null) {
        reconnect(settings);
      }

      store.dispatch(changeNetworkState("DISCONNECTED"));
    }
  }, 5000);
}

function constructUrl(s: SettingsState) {
  let url: URL;

  const nodeAddress = getNodeAddress();

  if (nodeAddress != null) {
    let useScheme: boolean = true;

    if (nodeAddress.startsWith("wss://") || nodeAddress.startsWith("ws://")) {
      useScheme = false;
    }

    try {
      if (useScheme) {
        url = new URL(`${s.ssl ? "wss" : "ws"}://${nodeAddress}:${CONST.HTTP_WS_PORT}`);
      } else {
        url = new URL(`${nodeAddress}:${CONST.HTTP_WS_PORT}`);
      }
    } catch (e) {
      // try without port if already specified
      if (useScheme) {
        url = new URL(`${s.ssl ? "wss" : "ws"}://${nodeAddress}`);
      } else {
        url = new URL(nodeAddress);
      }
    }
  } else {
    throw new Error("Can not construct address");
  }

  return url.href;
}

function reconnect(s: SettingsState) {
  console.log("in reconnect");

  if (client !== undefined) {
    try {
      client.close();
    } catch (e) {
      // ignored
    }
  }
  try {
    const url = constructUrl(s);
    console.log("new url for reconnection", url);

    client = new WebsocketClient(url, false, false);
  } catch (e) {
    // handle excaption if testnet node address didn't set
    console.log(e);
  }
}

export function getClient(): WebsocketClient {
  return client;
}

export function getNodeAddress(): string | null {
  if (settings == null) {
    return null;
  }

  const address = settings.nodeAddress;

  if (settings.net === "MAIN") {
    if (isProdAddress(address)) {
      return address;
    }
    return CONST.MAIN_NODE;
  } else if (settings.net === "TEST") {
    if (isTestAddress(address)) {
      return address;
    }
    return CONST.TEST_NODE;
  } else if (settings.net === "PRIVATE") {
    return settings.nodeAddress;
  } else {
    throw new Error("Wrong net");
  }
}

function isAddress(address: string) {
  return address !== undefined && address.trim() !== "";
}

function isProdAddress(address: string) {
  return isAddress(address) && propdOpts.node.address.includes(address);
}

function isTestAddress(address: string) {
  return isAddress(address) && testOpts.node.address.includes(address);
}
