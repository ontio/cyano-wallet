import { CONST, WebsocketClient } from "ontology-ts-sdk";

let client: WebsocketClient;

export function setClient(protocol: string, nodeAddress: string) {
    const url = `${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`;
    client = new WebsocketClient(url, true, false);
}

export function getClient(): WebsocketClient {
    return client;
}
