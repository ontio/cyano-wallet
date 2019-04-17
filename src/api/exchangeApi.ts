// import { TransactionBuilder, Transaction, Crypto } from "ontology-ts-sdk"; 
import { getContractAddress } from "./contractsApi";
// import { decryptAccount } from "./accountApi";
import axios from "axios";


export function prepareInt(num) {
  return Math.round(num * 100000000);
}

export async function exchangeOperation (wallet: any, amount: number) {
  const funcName = "Buy";
  const OxgExchangeAddres = await getContractAddress("OxgExchange");

  // const privateKey = decryptAccount(wallet, password);
  // const activeAccPrivateKey = new Crypto.PrivateKey(privateKey); // activeAccount.privateKey.key

  const params = [
    { label: "amount", value: prepareInt(amount), type: "Integer" },
    { label: "user", value: wallet.defaultAccountAddress, type: "ByteArray" }
  ];

  axios
    .post(`http://3.120.190.178:5000/api/compensate-gas`, {
      funcName,
      OxgExchangeAddres,
      params
    })
    .then(res => {
      // const tx = Transaction.deserialize(res.data);

      // TransactionBuilder.addSign(tx, activeAccPrivateKey);

      // rest
      //   .sendRawTransaction(tx.serialize())
      //   .then(res => {
      //     console.log(res);
      //   }
      //   })
      //   .catch(er => {
      //     console.log(er);
      //   });
    });
}