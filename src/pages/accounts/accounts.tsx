import * as React from "react";
import * as FileSaver from "file-saver";
import { RouterProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { encodeWallet, getWallet } from "src/api/authApi";
import { reduxConnect, withProps, withRouter } from "../../compose";
import { GlobalState, getStore } from "../../redux";
import Actions from "../../redux/actions";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { AccountsView, Props } from "./accountsView";
import { refreshBalance } from "../../balanceProvider";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      accountsFinishLoading: finishLoading,
      accountsSetWallet: Actions.wallet.setWallet,
      accountsStartLoading: startLoading
    },
    dispatch
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
      const wallet = getWallet(reduxProps.wallet!);
      const accounts = wallet.accounts.map(account => account.address.toBase58());
      const store = getStore();
      return withProps(
        {
          accounts,
          handleAccountClick: async (account: string) => {
            wallet.setDefaultAccount(account);
            const encodedWallet = encodeWallet(wallet);

            await actions.accountsStartLoading();
            await actions.accountsSetWallet(encodedWallet);

            await refreshBalance(store);

            await actions.accountsFinishLoading();

            props.history.push("/");
          },
          handleAccountDelClick: (account: string) => {
            // TODO: fix delete
            if (wallet.accounts.length > 1) {
              props.history.push("/account/del", { account });
            }
          },
          handleAdd: () => {
            props.history.push("/account/add");
          },
          handleBack: () => {
            props.history.push("/");
          },
          handleExport: () => {
            const blob = new Blob([JSON.stringify(reduxProps.wallet)!], {
              type: "text/plain;charset=utf-8"
            });
            FileSaver.saveAs(blob, "wallet.dat");
          },
          handleClear: () => {
            routerProps.history.push("/clear");
          },
          loading: reduxProps.loading,
          selectedAccount: wallet.defaultAccountAddress
        },
        injectedProps => <Component {...injectedProps} />
      );
    })
  );

export const AccountsPage = enhancer(AccountsView);
