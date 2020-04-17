import { OntfsContractTxBuilder, Transaction, TransactionBuilder } from "ontology-ts-sdk";
import { decryptAccount, getAccount } from "src/api/accountApi";
import { getWallet } from "src/api/authApi";
import { FsCallRequest } from "src/redux/transactionRequests";
import { getClient } from "../network";
import { getStore } from "../redux";

export async function fsCall(request: FsCallRequest, password: string): Promise<any> {
    const { parameters = [], gasPrice = 500, gasLimit = 30000, method, paramsHash } = request;
  
    const state = getStore().getState();
    const wallet = getWallet(state.wallet.wallet!);
    const account = getAccount(state.wallet.wallet!).address;
    const privateKey = decryptAccount(wallet, password);
    const client = getClient();

    let tx: Transaction;
    if (paramsHash && method !== 'fsGenFileReadSettleSlice') {
      tx = OntfsContractTxBuilder.buildTxByParamsHash(
        method,
        paramsHash,
        String(gasPrice),
        String(gasLimit),
        account
      );
    } else {
      switch(method) {
        case 'fsCreateSpace': {
          tx = OntfsContractTxBuilder.buildCreateSpaceTx(
            parameters.spaceOwner,
            parameters.volume,
            parameters.copyNumber,
            parameters.pdpInterval,
            parameters.timeExpired,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsDeleteSpace': {
          tx = OntfsContractTxBuilder.buildDeleteSpaceTx(
            parameters.spaceOwner,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsUpdateSpace': {
          tx = OntfsContractTxBuilder.buildUpdateSpaceTx(
            parameters.spaceOwner,
            parameters.spacePayer,
            parameters.volume,
            parameters.timeExpired,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsNodeRegister': {
          tx = OntfsContractTxBuilder.buildFsNodeRegisterTx(
            parameters.volume,
            parameters.serviceTime,
            parameters.minPdpInterval,
            parameters.nodeAddr,
            parameters.nodeNetAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsNodeUpdate': {
          tx = OntfsContractTxBuilder.buildNodeUpdateTx(
            parameters.volume,
            parameters.serviceTime,
            parameters.minPdpInterval,
            parameters.nodeAddr,
            parameters.nodeNetAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsNodeCancel': {
          tx = OntfsContractTxBuilder.buildNodeCancelTx(
            parameters.nodeAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsNodeWithDrawProfit': {
          tx = OntfsContractTxBuilder.buildNodeWithdrawoProfitTx(
            parameters.nodeAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsFileProve': {
          tx = OntfsContractTxBuilder.buildFileProveTx(
            parameters.nodeAddr,
            parameters.fileHash,
            parameters.proveData,
            parameters.blockHeight,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsReadFileSettle': {
          tx = OntfsContractTxBuilder.buildFileReadProfitSettleTx(
            parameters.fileReadSettleSlice,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsStoreFiles': {
          tx = OntfsContractTxBuilder.buildStoreFilesTx(
            parameters.filesInfo,
            parameters.fileOwner,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsChallenge': {
          tx = OntfsContractTxBuilder.buildChallengeTx(
            parameters.fileHash,
            parameters.fileOnwer,
            parameters.nodeAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsTransferFiles': {
          tx = OntfsContractTxBuilder.buildTransferFilesTx(
            parameters.fileTransfers,
            parameters.originOwner,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsRenewFiles': {
          tx = OntfsContractTxBuilder.buildRenewFilesTx(
            parameters.filesRenew,
            parameters.newFileOwner,
            parameters.newPayer,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsDeleteFiles': {
          tx = OntfsContractTxBuilder.buildDeleteFilesTx(
            parameters.fileHashes,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsReadFilePledge': {
          tx = OntfsContractTxBuilder.buildFileReadPledgeTx(
            parameters.fileHash,
            parameters.readPlans,
            parameters.downloader,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsCancelFileRead': {
          tx = OntfsContractTxBuilder.buildCancelFileReadTx(
            parameters.fileHash,
            parameters.downloader,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsGetFileHashList': {
          const passport = OntfsContractTxBuilder.genPassport(
              parameters.blockHeight,
              parameters.blockHash,
              privateKey
          );
          tx = OntfsContractTxBuilder.buildGetFileListTx(passport);
          return await client.sendRawTransaction(tx.serialize(), true).then(res => res.data);
        }
        case 'fsGenFileReadSettleSlice': {
          return await OntfsContractTxBuilder.genFileReadSettleSlice(
            parameters.fileHash,
            parameters.payTo,
            parameters.sliceId,
            parameters.pledgeHeight,
            privateKey
          );
        }
        case 'fsResponse': {
          tx = OntfsContractTxBuilder.buildResponseTx(
            parameters.nodeAddr,
            parameters.fileHash,
            parameters.proveData,
            parameters.blockHeight,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'fsJudge': {
          tx = OntfsContractTxBuilder.buildJudgeTx(
            parameters.fileHash,
            parameters.fileOwner,
            parameters.nodeAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        default: {
          throw new Error(`Fs method ${method} not supported.`);
        }
      }
    }

    await TransactionBuilder.signTransactionAsync(tx, privateKey);
  
    return await client.sendRawTransaction(tx.serialize(), false, true);
  }