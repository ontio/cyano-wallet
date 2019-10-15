import { Provider, ProviderApi } from '@ont-dev/ontology-dapi';
import { browser } from 'webextension-polyfill-ts';

export const providerApi: ProviderApi = {
  getProvider(): Promise<Provider> {
    return browser.management.getSelf().then(info => ({
      compatibility: [ 'OEP-6' ],
      name: info.name,
      version: info.version
    }));
  }
}
