import { ProviderApi } from 'ontology-dapi';
import { browser } from 'webextension-polyfill-ts';

export const providerApi: ProviderApi = {
  isInstalled(): Promise<boolean> {
    return Promise.resolve(true);
  },

  getName(): Promise<string> {
    return browser.management.getSelf().then(info => info.name);
  },

  getVersion(): Promise<string> {
    return browser.management.getSelf().then(info => info.version);
  }
}
