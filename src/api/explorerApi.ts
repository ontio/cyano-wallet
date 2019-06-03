import axios from "axios";
import { flatMap, get } from "lodash";
import { AssetType, Transfer, AmountType } from "../redux/runtime";
import { decodeAmount } from "src/utils/number";
import { getOptions } from "../api/constants";

export async function getTransferList(address: string) {
  const options = getOptions();
  const endpoint = options.blockExplorer.address;

  const url = `${endpoint}/explorer/address/${address}/30/1`;

  const response = await axios.get(url);

  const txnList: any[] = get(response.data, "Result.TxnList", []);

  return flatMap(
    txnList.map(tx => {
      const txnTime: number = get(tx, "TxnTime", 0);
      const transferList: any[] = get(tx, "TransferList", []);

      return transferList.map(transfer => {
        return {
          amount: translateAmount((get(transfer, "Amount")), (get(transfer, "AssetName"))),
          asset: translateAsset(get(transfer, "AssetName")),
          from: get(transfer, "FromAddress"),
          time: txnTime,
          to: get(transfer, "ToAddress")
        } as Transfer;
      });
    })
  );
}

function translateAmount(amount: any, asset: any): AmountType  {
  if (asset === "ont") {
    return decodeAmount(amount, 8);
  } else if (asset === "ong") {
    return decodeAmount(amount, 0);
  } 
}

function translateAsset(asset: any): AssetType {
  if (asset === "ont") {
    return "ONYX";
  } else if (asset === "ong") {
    return "OXG";
  } else {
    return "ONYX";
  }
}
