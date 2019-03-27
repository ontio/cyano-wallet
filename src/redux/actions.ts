import { clearWallet, setWallet } from "./wallet";
import { setBalance, setTransfers } from "./runtime";

export default {
  wallet: { clearWallet, setWallet },
  runtime: { setBalance, setTransfers }
};
