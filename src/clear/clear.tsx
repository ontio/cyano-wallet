import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { clearWallet } from '../auth/authActions';
import { clear } from '../auth/authApi';
import { reduxConnect, withProps } from '../compose';
import { finishLoading, startLoading } from '../loader/loaderActions';
import { ClearView, Props } from './clearView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ clearWallet, startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleClear: async () => {
       
        actions.startLoading();
  
        await clear();
        actions.clearWallet();
  
        actions.finishLoading();
  
        props.history.push('/');
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} />
    ))
  ))
)

export const Clear = enhancer(ClearView);
