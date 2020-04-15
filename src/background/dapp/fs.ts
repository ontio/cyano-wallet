import { Challenge, ChallengeList, FileHashList, FileInfo, FsNodeInfo, FsNodeInfoList, PdpRecordList, ReadPledge, Space } from "@ont-dev/ontology-dapi";
import { FsAPI, FsSpaceAPI } from "@ont-dev/ontology-dapi/lib/types/api/fs";
import { Account, Crypto, OntfsContractTxBuilder, utils } from 'ontology-ts-sdk';
import { getAccount } from "src/api/accountApi";
import { getClient } from "../network";
import { getStore } from "../redux";
import { getRequestsManager } from "../requestsManager";

const { Address } = Crypto; 
const { isHexString, str2hexstr } = utils;

function getCurrentAccount(): Account {
  const state = getStore().getState();
  const wallet = state.wallet.wallet;
  if (wallet === null) {
    throw new Error('NO_ACCOUNT');
  }
  return getAccount(wallet);
}

const space: FsSpaceAPI = {
  async create({volume, copyNumber, pdpInterval, timeExpired}): Promise<string> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsCreateSpace',
      parameters: {
        copyNumber,
        pdpInterval,
        spaceOwner: address,
        timeExpired,
        volume
      }
    })
  },

  async delete(): Promise<string> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsDeleteSpace',
      parameters: {
        spaceOwner: address
      }
    });
  },

  async update({volume, timeExpired}): Promise<string> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsDeleteSpace',
      parameters: {
        spaceOwner: address,
        spacePayer: address,
        timeExpired,
        volume
      }
    });
  },

  async get(): Promise<Space> {
    const { address }= getCurrentAccount();
    const tx = OntfsContractTxBuilder.buildGetSpaceInfoTx(address);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  }
}

export const fsDapi: FsAPI = {
  space,
  async getNodeInfo({nodeWallet}): Promise<FsNodeInfo> {
    const tx = OntfsContractTxBuilder.buildNodeQueryTx(new Address(nodeWallet));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async getNodeInfoList({count}): Promise<FsNodeInfoList> {
    const tx = OntfsContractTxBuilder.buildGetNodeInfoListTx(count);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data)
  },

  async getFileReadPledge({fileHash, downloader}): Promise<ReadPledge> {
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFileReadPledgeTx(fileHash, new Address(downloader));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async getFilePdpRecordList({fileHash}): Promise<PdpRecordList> {
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFilePdpRecordListTx(fileHash);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async getChallenge({fileHash, nodeAddr}): Promise<Challenge> {
    const { address }= getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetChanllengeTx(fileHash, address, new Address(nodeAddr));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async getFileChallengeList({fileHash}): Promise<ChallengeList> {
    const { address }= getCurrentAccount();

    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFileChallengeListTx(fileHash, address);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async getNodeChallengeList(): Promise<ChallengeList> {
    const { address }= getCurrentAccount();
    const tx = OntfsContractTxBuilder.buildGetNodeChallengeListTx(address);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async getFileInfo({fileHash}): Promise<FileInfo> {
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFileInfoTx(fileHash);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
  },

  async storeFiles({filesInfo}): Promise<string> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
        method: 'fsStoreFiles',
        parameters: {
          fileOwner: address,
          filesInfo
        }
    });
  },

  async getFileList(): Promise<FileHashList> {
    return Promise.reject('Not Implemented Yet.');
    // const state = getStore().getState();
    // const wallet = state.wallet.wallet;

    
    
    // const client = getClient();
    // const blockHeight = (await client.getBlockHeight()) as number;
    // const blockHash = (await client.getBlockHash(blockHeight)) as string;
    // OntfsContractTxBuilder.buildGetFileListTx(blockHeight, blockHash, )

    // return await getRequestsManager().initFsCall({
    //   method: 'fsGe'
    // })
  },

  async chanllenge({fileHash, nodeAddr}): Promise<string> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsChallenge',
      parameters: {
        fileHash,
        fileOwner: address,
        nodeAddr
      }
    })
  },

  async transferFiles({fileTransfers}): Promise<string> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsTransferFiles',
      parameters: {
        fileTransfers,
        originOwner: address
      }
    })
  },

  async renewFiles({filesRenew}): Promise<string> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsRenewFiles',
      parameters: {
        filesRenew,
        newFileOwner: address,
        newPayer: address
      }
    })
  },

  async deleteFiles({fileHashes}): Promise<string> {
    return await getRequestsManager().initFsCall({
      method: 'fsDeleteFiles',
      parameters: {
        fileHashes
      }
    })
  },

  async fileReadPledge({fileHash, readPlans}): Promise<string> {
    const { address } = getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsReadFilePledge',
      parameters: {
        downloader: address,
        fileHash,
        readPlans
      }
    })
  },

  async cancelFileRead({fileHash}): Promise<string> {
    const { address } = getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsDeleteFiles',
      parameters: {
        downloader: address,
        fileHash
      }
    })
  }
}