import { provider } from 'ontology-dapi';
import * as asset from './asset';
import * as network from './network';

export function initDApiProvider() {
  provider.registerProvider(
    {
      asset,
      network
    }
  );
}
