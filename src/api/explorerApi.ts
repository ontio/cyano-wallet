import axios from "axios";
import { flatMap, get } from "lodash";
import { AssetType, Transfer } from "../redux/runtime";
import { decodeAmount } from "src/utils/number";

export async function getTransferList(address: string) {
  const url = `http://18.202.221.73/api/v1/explorer/address/time/${address}/ont/0`;

  const response = await axios.get(url);

  const txnList: any[] = get(response.data, "Result.TxnList", []);

  return flatMap(
    txnList.map(tx => {
      const txnTime: number = get(tx, "TxnTime", 0);
      const transferList: any[] = get(tx, "TransferList", []);

      return transferList.map(
        transfer => {
          return ({
            amount: decodeAmount(get(transfer, "Amount", "0"), 8),
            asset: translateAsset(get(transfer, "AssetName")),
            from: get(transfer, "FromAddress"),
            time: txnTime,
            to: get(transfer, "ToAddress")
          } as Transfer)
        }
      );
    })
  );
}

function translateAsset(asset: any): AssetType {
  if (asset === "onyx") {
    return "ONYX";
  } else if (asset === "oxg") {
    return "OXG";
  } else {
    return "ONYX";
  }
}
