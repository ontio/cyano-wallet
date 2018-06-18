import { get } from 'lodash';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { setWallet } from '../auth/authActions';
import { signUp } from '../auth/authApi';
import { reduxConnect, withProps } from '../compose';
import { finishLoading, startLoading } from '../loader/loaderActions';
import { CreateView, Props } from './createView';

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
  
        actions.startLoading();
  
        const { encryptedWif, mnemonics, wif, wallet } = await signUp(password);
        actions.setWallet(wallet);
  
        actions.finishLoading();
  
        props.history.push('/new', { encryptedWif, mnemonics, wif });
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={state.loading} />
    ))
  ))
)

export const Create = enhancer(CreateView);
