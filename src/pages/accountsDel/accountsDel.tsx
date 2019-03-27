/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import { get } from "lodash";
import { Wallet } from "ontology-ts-sdk";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { accountDelete } from "../../api/authApi";
// import { getBackgroundManager } from 'src/popup/backgroundManager';
import { reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import Actions from "../../redux/actions";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { AccountsDelView, Props } from "./accountsDelView";

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

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const account: string = get(props.location, "state.account");

    return withProps(
      {
        account,
        handleCancel: async () => {
          props.history.goBack();
        },
        handleConfirm: async () => {
          await actions.accountsFinishLoading();

          if (reduxProps.wallet != null) {
            const { wallet } = accountDelete(account, reduxProps.wallet as Wallet);
            await actions.accountsSetWallet(wallet);

            // await getBackgroundManager().refreshBalance();
          }
          await actions.accountsFinishLoading();

          props.history.push("/account/change");
        },
        loading: reduxProps.loading
      },
      injectedProps => <Component {...injectedProps} />
    );
  });

export const AccountsDelPage = enhancer(AccountsDelView);
