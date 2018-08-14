import { provider } from 'ontology-dapi';
import * as asset from './asset';
import * as network from './network';

export function registerConnector() {
  provider.registerProvider(
    {
      asset,
      network
    }
  );
}
