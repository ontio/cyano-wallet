import { Challenge, ChallengeList, FileHashList, FileInfo, FileReadSettleSlice, FsAPI, FsNodeAPI, FsNodeInfo, FsNodeInfoList, FsSpaceAPI, PdpRecordList, ReadPledge, Space } from "@ont-dev/ontology-dapi";
import { Account, Crypto, FS, OntfsContractTxBuilder, utils } from 'ontology-ts-sdk';
import { getAccount } from "src/api/accountApi";
import { getClient } from "../network";
import { getStore } from "../redux";
import { getRequestsManager } from "../requestsManager";

const { Address } = Crypto; 
const { isHexString, str2hexstr } = utils;
const { 
  FsNodeInfo: FsNodeInfoClass, FsNodeInfoList: FsNodeInfoListClass, 
  SpaceInfo, ReadPledge: ReadPledgeClass, PdpRecordList: PdpRecordListClass,
  Challenge: ChallengeClass, ChallengeList: ChallengeListClass,
  FileInfo: FileInfoClass
} = FS;

function getCurrentAccount(): Account {
  const state = getStore().getState();
  const wallet = state.wallet.wallet;
  if (wallet === null) {
    throw new Error('NO_ACCOUNT');
  }
  return getAccount(wallet);
}

const space: FsSpaceAPI = {
  async create({volume, copyNumber, pdpInterval, timeExpired}): Promise<Response> {
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

  async delete(): Promise<Response> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsDeleteSpace',
      parameters: {
        spaceOwner: address
      }
    });
  },

  async update({volume, timeExpired}): Promise<Response> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsUpdateSpace',
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
    return await client.sendRawTransaction(tx.serialize(), true).then(res => {
      const spaceInfo = SpaceInfo.deserializeHex(res.Result.Result);
      return spaceInfo.export();
    });
  }
}

const node: FsNodeAPI = {
  async register({volume, serviceTime, minPdpInterval, nodeNetAddr}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsNodeRegister',
      parameters: {
        minPdpInterval,
        nodeAddr: address,
        nodeNetAddr,
        serviceTime,
        volume
      }
    });
  },

  async query({nodeWallet}): Promise<FsNodeInfo> {
    const tx = OntfsContractTxBuilder.buildNodeQueryTx(new Address(nodeWallet));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const nodeInfo = FsNodeInfoClass.deserializeHex(res.Result.Result);
      return nodeInfo.export();
    });
  },

  async update({volume, serviceTime, minPdpInterval, nodeNetAddr}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsNodeUpdate',
      parameters: {
        minPdpInterval,
        nodeAddr: address,
        nodeNetAddr,
        serviceTime,
        volume
      }
    });
  },

  async cancel(): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsNodeCancel',
      parameters: {
        nodeAddr: address
      }
    })
  },

  async drawProfit(): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsNodeWithDrawProfit',
      parameters: {
        nodeAddr: address
      }
    });
  },

  async fileProve({fileHash, proveData, blockHeight}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsFileProve',
      parameters: {
        blockHeight,
        fileHash,
        nodeAddr: address,
        proveData
      }
    })
  }
}

export const fsDapi: FsAPI = {
  node,
  space,
  async fileReadProfitSettle({fileReadSettleSlice}): Promise<Response> {
    return getRequestsManager().initFsCall({
      method: 'fsReadFileSettle',
      parameters: {
        fileReadSettleSlice
      }
    });
  },

  async verifyFileReadSettleSlice({settleSlice}): Promise<boolean> {
    return await OntfsContractTxBuilder.verifyFileReadSettleSlice(settleSlice);
  },

  async getNodeInfo({nodeWallet}): Promise<FsNodeInfo> {
    const tx = OntfsContractTxBuilder.buildNodeQueryTx(new Address(nodeWallet));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const nodeInfo = FsNodeInfoClass.deserializeHex(res.Result.Result);
      return nodeInfo.export();
    });
  },

  async getNodeInfoList({count}): Promise<FsNodeInfoList> {
    const tx = OntfsContractTxBuilder.buildGetNodeInfoListTx(count);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const nodeInfoList = FsNodeInfoListClass.deserializeHex(res.Result.Result);
      return nodeInfoList.export();
    })
  },

  async getFileReadPledge({fileHash, downloader}): Promise<ReadPledge> {
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFileReadPledgeTx(fileHash, new Address(downloader));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const readPledge = ReadPledgeClass.deserializeHex(res.Result.Result);
      return readPledge.export();
    });
  },

  async getFilePdpRecordList({fileHash}): Promise<PdpRecordList> {
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFilePdpRecordListTx(fileHash);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const pdpRecordList = PdpRecordListClass.deserializeHex(res.Result.Result);
      return pdpRecordList.export();
    });
  },

  async getChallenge({fileHash, nodeAddr}): Promise<Challenge> {
    const { address }= getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetChanllengeTx(fileHash, address, new Address(nodeAddr));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const challenge = ChallengeClass.deserializeHex(res.Result.Result);
      return challenge.export();
    });
  },

  async getFileChallengeList({fileHash}): Promise<ChallengeList> {
    const { address }= getCurrentAccount();

    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFileChallengeListTx(fileHash, address);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const challengeList = ChallengeListClass.deserializeHex(res.Result.Result);
      return challengeList.export();
    });
  },

  async getNodeChallengeList(): Promise<ChallengeList> {
    const { address }= getCurrentAccount();
    const tx = OntfsContractTxBuilder.buildGetNodeChallengeListTx(address);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const challengeList = ChallengeListClass.deserializeHex(res.Result.Result);
      return challengeList.export();
    });
  },

  async getFileInfo({fileHash}): Promise<FileInfo> {
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    const tx = OntfsContractTxBuilder.buildGetFileInfoTx(fileHash);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const fileInfo = FileInfoClass.deserializeHex(res.Result.Result);
      return fileInfo.export();
    });
  },

  async storeFiles({filesInfo}): Promise<Response> {
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
    const client = getClient();
    const blockHeight = (await client.getBlockHeight()).Result as number;
    const blockHash = (await client.getBlockHash(blockHeight)).Result as string;
    return await getRequestsManager().initFsCall({
      method: 'fsGetFileHashList',
      parameters: {
        blockHash,
        blockHeight
      }
    });
  },

  async chanllenge({fileHash, nodeAddr}): Promise<Response> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsChallenge',
      parameters: {
        fileHash,
        fileOwner: address,
        nodeAddr: new Address(nodeAddr)
      }
    })
  },

  async transferFiles({fileTransfers}): Promise<Response> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsTransferFiles',
      parameters: {
        fileTransfers: fileTransfers.map(transfer => {
          return {
            ...transfer,
            newOwner: new Address(transfer.newOwner)
          }
        }),
        originOwner: address
      }
    })
  },

  async renewFiles({filesRenew}): Promise<Response> {
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

  async deleteFiles({fileHashes}): Promise<Response> {
    return await getRequestsManager().initFsCall({
      method: 'fsDeleteFiles',
      parameters: {
        fileHashes
      }
    })
  },

  async fileReadPledge({fileHash, readPlans}): Promise<Response> {
    const { address } = getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsReadFilePledge',
      parameters: {
        downloader: address,
        fileHash,
        readPlans: readPlans.map(plan => {
          return {
            ...plan,
            nodeAddr: new Address(plan.nodeAddr)
          }
        })
      }
    })
  },

  async cancelFileRead({fileHash}): Promise<Response> {
    const { address } = getCurrentAccount();
    return await getRequestsManager().initFsCall({
      method: 'fsCancelFileRead',
      parameters: {
        downloader: address,
        fileHash
      }
    })
  },

  async response({fileHash, proveData, blockHeight}): Promise<Response> {
    const { address: nodeAddr } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsResponse',
      parameters: {
        blockHeight,
        fileHash,
        nodeAddr,
        proveData
      }
    })
  },

  async judge({fileHash, nodeAddr}): Promise<Response> {
    const { address: fileOwner } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      method: 'fsJudge',
      parameters: {
        fileHash,
        fileOwner,
        nodeAddr: new Address(nodeAddr)
      }
    })
  },

  /**
   * FIXME: this function just needs user to sign the settle slice, not to send a transaction.
   */
  async genFileReadSettleSlice({fileHash, payTo, sliceId, pledgeHeight}): Promise<FileReadSettleSlice> {
    return getRequestsManager().initFsCall({
      method: 'fsGenFileReadSettleSlice',
      parameters: {
        fileHash,
        payTo: new Address(payTo),
        pledgeHeight,
        sliceId
      }
    })
  }
}