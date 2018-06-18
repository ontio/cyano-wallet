import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { compose } from 'recompose';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { setWallet } from '../auth/authActions';
import { importPrivateKey } from '../auth/authApi';
import { withProps } from '../compose';
import { ImportView, Props } from './importView';

interface Actions {
  setWallet: (wallet: string) => void;
}

const mapStateToProps = (state: GlobalState, ownProps: RouterProps) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: RouterProps) => bindActionCreators({ setWallet }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: Actions & RouterProps) => (
  withProps({
    handleCancel: () => {
      props.history.goBack();
    },
    handleSubmit: async (values: object) => {
      const password = get(values, 'password', '');
      const wif = get(values, 'privateKey', '');

      const { wallet } = await importPrivateKey(wif, password, true);
      props.setWallet(wallet);

      props.history.push('/dashboard');
    },    
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
)

export const Import = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(enhancer(ImportView));
