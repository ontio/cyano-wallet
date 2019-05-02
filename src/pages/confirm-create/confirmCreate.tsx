import * as React from 'react';
import { get } from 'lodash';
import { withProps, reduxConnect } from '../../compose';
import { confirmCreateView, Props } from './confirmCreateView';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from "redux";
import { GlobalState } from 'src/redux';
import Actions from "../../redux/actions";
import { createAccount } from  "../../api/authApi";
import { FORM_ERROR } from "final-form";

const mapStateToProps = (state: GlobalState) => ({
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setWallet: Actions.wallet.setWallet }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const mnemonics = get(props.location, 'state.mnemonics', '');
  const password = get(props.location, 'state.password', '');
  return (
    reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
      withProps({
        mnemonics,
        password,
        handleConfirm: async (data) => {

          if (mnemonics === data.mnemonics) {

            const { wallet } = await createAccount(
              reduxProps.nodeAddress,
              reduxProps.ssl,
              mnemonics,
              password,
              reduxProps.wallet
            );
            actions.setWallet(wallet);

            props.history.push('/dashboard');
          } else {
            return { [FORM_ERROR]: true };
          }

          return {};
        }
      }, (injectedProps) => (
        <Component {...injectedProps} />
      ))
    )
  )
};
export const ConfirmCreate = enhancer(confirmCreateView);
