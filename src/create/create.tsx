import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { compose } from 'recompose';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { setWallet } from '../auth/authActions';
import { signUp } from '../auth/authApi';
import { withProps } from '../compose';
import { finishLoading, startLoading } from '../loader/loaderActions';
import { CreateView, Props } from './createView';

interface Actions {
  setWallet: (wallet: string) => void;
  startLoading: () => void;
  finishLoading: () => void;
}

interface ReduxState {
  loading: boolean;
}

const mapStateToProps = (state: GlobalState, ownProps: RouterProps) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: RouterProps) => bindActionCreators({ setWallet, startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: Actions & RouterProps & ReduxState) => (
  withProps({
    handleCancel: () => {
      props.history.goBack();
    },
    handleSubmit: async (values: object) => {
      const password = get(values, 'password', '');

      props.startLoading();

      const { encryptedWif, mnemonics, wif, wallet } = await signUp(password);
      props.setWallet(wallet);

      props.finishLoading();

      props.history.push('/new', { encryptedWif, mnemonics, wif });
    }
  }, (injectedProps) => (
    <Component {...injectedProps} loading={props.loading} />
  ))
)

export const Create = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(enhancer(CreateView));
