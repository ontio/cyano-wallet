import { get } from 'lodash';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { setWallet } from '../auth/authActions';
import { importMnemonics } from '../auth/authApi';
import { reduxConnect, withProps } from '../compose';
import { finishLoading, startLoading } from '../loader/loaderActions';
import { Props, RestoreView } from './restoreView';


const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setWallet, startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (state, actions) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async (values: object) => {
        const password = get(values, 'password', '');
        const mnemonics = get(values, 'mnemonics', '');

        actions.startLoading();

        const { encryptedWif, wif, wallet } = await importMnemonics(mnemonics, password, true);
        actions.setWallet(wallet);

        actions.finishLoading();

        props.history.push('/new', { encryptedWif, mnemonics, wif });
      },    
    }, (injectedProps) => (
      <Component {...injectedProps} loading={state.loading} />
    ))
  ))
)

export const Restore = enhancer(RestoreView);
