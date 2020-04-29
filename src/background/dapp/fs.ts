import { Challenge, ChallengeList, FileHashList, FileInfo,
  FileReadSettleSlice, FsAPI, FsNodeAPI, FsNodeInfo, FsNodeInfoList,
  FsSpaceAPI, PdpRecordList, ReadPledge, Response, Space } from "@ont-dev/ontology-dapi";
import { Account, Crypto, FS, OntfsContractTxBuilder, utils } from 'ontology-ts-sdk';
import { getAccount } from "src/api/accountApi";
import { getClient } from "../network";
import { getStore } from "../redux";
import { getRequestsManager } from "../requestsManager";

const { Address } = Crypto; 
const { isHexString, str2hexstr, hexstr2str } = utils;
const { 
  FsNodeInfo: FsNodeInfoClass, FsNodeInfoList: FsNodeInfoListClass, 
  SpaceInfo, ReadPledge: ReadPledgeClass, PdpRecordList: PdpRecordListClass,
  Challenge: ChallengeClass, ChallengeList: ChallengeListClass,
  FileInfo: FileInfoClass, FsResult
} = FS;

function getCurrentAccount(): Account {
  const state = getStore().getState();
  const wallet = state.wallet.wallet;
  if (wallet === null) {
    throw new Error('NO_ACCOUNT');
  }
  return getAccount(wallet);
}

function getFsResultData(res: any): string {
  const { success, data } = FsResult.deserializeHex(res.Result.Result);
  if (!success) {
    throw new Error(hexstr2str(data));
  }
  return data;
}

const space: FsSpaceAPI = {
  async create({volume, copyNumber, timeStart, timeExpired, gasPrice, gasLimit}): Promise<Response> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsCreateSpace',
      parameters: {
        copyNumber,
        spaceOwner: address,
        timeExpired: new Date(timeExpired),
        timeStart: new Date(timeStart),
        volume
      },
    })
  },

  async delete({gasLimit, gasPrice}): Promise<Response> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsDeleteSpace',
      parameters: {
        spaceOwner: address
      }
    });
  },

  async update({volume, timeExpired, gasLimit, gasPrice}): Promise<Response> {
    const { address }= getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsUpdateSpace',
      parameters: {
        gasLimit,
        gasPrice,
        spaceOwner: address,
        spacePayer: address,
        timeExpired: new Date(timeExpired),
        volume
      }
    });
  },

  async get(): Promise<Space> {
    const { address }= getCurrentAccount();
    const tx = OntfsContractTxBuilder.buildGetSpaceInfoTx(address);
    const client = getClient();
    return await client.sendRawTransaction(tx.serialize(), true).then((res) => {
      const spaceInfo = SpaceInfo.deserializeHex(getFsResultData(res));
      return spaceInfo.export();
    });
  }
}

const node: FsNodeAPI = {
  async register({volume, serviceTime, nodeNetAddr, gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsNodeRegister',
      parameters: {
        nodeAddr: address,
        nodeNetAddr,
        serviceTime: new Date(serviceTime),
        volume
      }
    });
  },

  async query({nodeWallet}): Promise<FsNodeInfo> {
    const tx = OntfsContractTxBuilder.buildNodeQueryTx(new Address(nodeWallet));
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const nodeInfo = FsNodeInfoClass.deserializeHex(getFsResultData(res));
      return nodeInfo.export();
    });
  },

  async update({volume, serviceTime, nodeNetAddr, gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsNodeUpdate',
      parameters: {
        nodeAddr: address,
        nodeNetAddr,
        serviceTime: new Date(serviceTime),
        volume
      }
    });
  },

  async cancel({gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsNodeCancel',
      parameters: {
        nodeAddr: address
      }
    })
  },

  async drawProfit({gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsNodeWithDrawProfit',
      parameters: {
        nodeAddr: address
      }
    });
  },

  async fileProve({fileHash, proveData, blockHeight, gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsFileProve',
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
  async fileReadProfitSettle({fileReadSettleSlice, gasLimit, gasPrice}): Promise<Response> {
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsReadFileSettle',
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
      const nodeInfo = FsNodeInfoClass.deserializeHex(getFsResultData(res));
      return nodeInfo.export();
    });
  },

  async getNodeInfoList({count}): Promise<FsNodeInfoList> {
    if (count <= 0) {
      return Promise.reject(`Count(${count}) is not allowed to be less than 1.`);
    }
    const tx = OntfsContractTxBuilder.buildGetNodeInfoListTx(count);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const nodeInfoList = FsNodeInfoListClass.deserializeHex(getFsResultData(res));
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
      const readPledge = ReadPledgeClass.deserializeHex(getFsResultData(res));
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
      const pdpRecordList = PdpRecordListClass.deserializeHex(getFsResultData(res));
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
      const challenge = ChallengeClass.deserializeHex(getFsResultData(res));
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
      const challengeList = ChallengeListClass.deserializeHex(getFsResultData(res));
      return challengeList.export();
    });
  },

  async getNodeChallengeList(): Promise<ChallengeList> {
    const { address }= getCurrentAccount();
    const tx = OntfsContractTxBuilder.buildGetNodeChallengeListTx(address);
    const client = getClient();
    return client.sendRawTransaction(tx.serialize(), true).then(res => {
      const challengeList = ChallengeListClass.deserializeHex(getFsResultData(res));
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
      const fileInfo = FileInfoClass.deserializeHex(getFsResultData(res));
      return fileInfo.export();
    });
  },

  async storeFiles({filesInfo, gasLimit, gasPrice}): Promise<Response> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
       gasLimit,
       gasPrice,
        method: 'FsStoreFiles',
        parameters: {
          fileOwner: address,
          filesInfo: filesInfo.map(info => {
            return {
              ...info,
              timeExpired: new Date(info.timeExpired),
              timeStart: new Date(info.timeStart)
            }
          })
        }
    });
  },

  async getFileList(): Promise<FileHashList> {
    const client = getClient();
    const blockHeight = (await client.getBlockHeight()).Result as number;
    const blockHash = (await client.getBlockHash(blockHeight)).Result as string;
    return await getRequestsManager().initFsCall({
      method: 'FsGetFileList',
      parameters: {
        blockHash,
        blockHeight
      }
    });
  },

  async chanllenge({fileHash, nodeAddr, gasLimit, gasPrice}): Promise<Response> {
    const { address }= getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return await getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsChallenge',
      parameters: {
        fileHash,
        fileOwner: address,
        nodeAddr: new Address(nodeAddr)
      }
    })
  },

  async transferFiles({fileTransfers, gasLimit, gasPrice}): Promise<Response> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsTransferFiles',
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

  async renewFiles({filesRenew, gasLimit, gasPrice}): Promise<Response> {
    const { address }= getCurrentAccount();
    return await getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsRenewFiles',
      parameters: {
        filesRenew: filesRenew.map(renew => {
          return {
            ...renew,
            renewTime: new Date(renew.renewTime)
          }
        }),
        newFileOwner: address,
        newPayer: address
      }
    })
  },

  async deleteFiles({fileHashes, gasLimit, gasPrice}): Promise<Response> {
    fileHashes = fileHashes.map(fileHash => isHexString(fileHash)? fileHash : str2hexstr(fileHash))
    return await getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsDeleteFiles',
      parameters: {
        fileHashes
      }
    })
  },

  async fileReadPledge({fileHash, readPlans, gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return await getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsReadFilePledge',
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

  async cancelFileRead({fileHash, gasLimit, gasPrice}): Promise<Response> {
    const { address } = getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return await getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsCancelFileRead',
      parameters: {
        downloader: address,
        fileHash
      }
    })
  },

  async response({fileHash, proveData, blockHeight, gasLimit, gasPrice}): Promise<Response> {
    const { address: nodeAddr } = getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsResponse',
      parameters: {
        blockHeight,
        fileHash,
        nodeAddr,
        proveData
      }
    })
  },

  async judge({fileHash, nodeAddr, gasLimit, gasPrice}): Promise<Response> {
    const { address: fileOwner } = getCurrentAccount();
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return getRequestsManager().initFsCall({
      gasLimit,
      gasPrice,
      method: 'FsJudge',
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
    if (!isHexString(fileHash)) {
      fileHash = str2hexstr(fileHash);
    }
    return getRequestsManager().initFsCall({
      method: 'FsGenFileReadSettleSlice',
      parameters: {
        fileHash,
        payTo: new Address(payTo),
        pledgeHeight,
        sliceId
      }
    })
  }
}