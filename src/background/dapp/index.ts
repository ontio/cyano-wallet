import { provider } from 'ontology-dapi';
import { assetApi as asset } from './asset';
import { identityApi as identity } from './identity';
import { messageApi as message } from './message';
import { networkApi as network } from './network';
import { smartContractApi as smartContract } from './smartContract';

export function initDApiProvider() {
  provider.registerProvider(
    {
      asset,
      identity,
      message,
      network,
      smartContract
    }
  );
}
