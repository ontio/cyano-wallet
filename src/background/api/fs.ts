import { FS, OntfsContractTxBuilder, Transaction, TransactionBuilder } from "ontology-ts-sdk";
import { decryptAccount, getAccount } from "src/api/accountApi";
import { getWallet } from "src/api/authApi";
import { FsCallRequest } from "src/redux/transactionRequests";
import { getClient } from "../network";
import { getStore } from "../redux";

const { FileHashList, FsResult } = FS;

export async function fsCall(request: FsCallRequest, password: string): Promise<any> {
    const { parameters = [], gasPrice = 500, gasLimit = 30000, method, paramsHash } = request;
  
    const state = getStore().getState();
    const wallet = getWallet(state.wallet.wallet!);
    const account = getAccount(state.wallet.wallet!).address;
    const privateKey = decryptAccount(wallet, password);
    const client = getClient();

    let tx: Transaction;
    if (paramsHash && method !== 'FsGenFileReadSettleSlice') {
      tx = OntfsContractTxBuilder.buildTxByParamsHash(
        method,
        paramsHash,
        String(gasPrice),
        String(gasLimit),
        account
      );
    } else {
      switch(method) {
        case 'FsCreateSpace': {
          tx = OntfsContractTxBuilder.buildCreateSpaceTx(
            parameters.spaceOwner,
            parameters.volume,
            parameters.copyNumber,
            parameters.timeStart,
            parameters.timeExpired,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsDeleteSpace': {
          tx = OntfsContractTxBuilder.buildDeleteSpaceTx(
            parameters.spaceOwner,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsUpdateSpace': {
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
        case 'FsNodeRegister': {
          tx = OntfsContractTxBuilder.buildFsNodeRegisterTx(
            parameters.volume,
            parameters.serviceTime,
            parameters.nodeAddr,
            parameters.nodeNetAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsNodeUpdate': {
          tx = OntfsContractTxBuilder.buildNodeUpdateTx(
            parameters.volume,
            parameters.serviceTime,
            parameters.nodeAddr,
            parameters.nodeNetAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsNodeCancel': {
          tx = OntfsContractTxBuilder.buildNodeCancelTx(
            parameters.nodeAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsNodeWithDrawProfit': {
          tx = OntfsContractTxBuilder.buildNodeWithdrawoProfitTx(
            parameters.nodeAddr,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsFileProve': {
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
        case 'FsReadFileSettle': {
          tx = OntfsContractTxBuilder.buildFileReadProfitSettleTx(
            parameters.fileReadSettleSlice,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsStoreFiles': {
          tx = OntfsContractTxBuilder.buildStoreFilesTx(
            parameters.filesInfo,
            parameters.fileOwner,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsChallenge': {
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
        case 'FsTransferFiles': {
          tx = OntfsContractTxBuilder.buildTransferFilesTx(
            parameters.fileTransfers,
            parameters.originOwner,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsRenewFiles': {
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
        case 'FsDeleteFiles': {
          tx = OntfsContractTxBuilder.buildDeleteFilesTx(
            parameters.fileHashes,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        case 'FsReadFilePledge': {
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
        case 'FsCancelFileRead': {
          tx = OntfsContractTxBuilder.buildCancelFileReadTx(
            parameters.fileHash,
            parameters.downloader,
            String(gasPrice),
            String(gasLimit),
            account
          );
          break;
        }
        /**
         * This will send a pre-invoke transaction.
         * The transaction needs a passport that needs signing from user
         */
        case 'FsGetFileList': {
          const passport = OntfsContractTxBuilder.genPassport(
              parameters.blockHeight,
              parameters.blockHash,
              privateKey
          );
          tx = OntfsContractTxBuilder.buildGetFileListTx(passport);
          return await client.sendRawTransaction(tx.serialize(), true).then(res => {
            return FileHashList.deserializeHex(FsResult.deserializeHex(res.Result.Result).data).export();
          });
        }
        /**
         * This will not send a transaction.
         * Still it needs user's signature.
         */
        case 'FsGenFileReadSettleSlice': {
          return await OntfsContractTxBuilder.genFileReadSettleSlice(
            parameters.fileHash,
            parameters.payTo,
            parameters.sliceId,
            parameters.pledgeHeight,
            privateKey
          ).export();
        }
        case 'FsResponse': {
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
        case 'FsJudge': {
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