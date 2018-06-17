import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { compose } from 'recompose';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { signUp } from '../auth/authActions';
import { withProps } from '../compose';
import { CreateView, Props } from './createView';

interface Actions {
  signUp: (password: string) => Promise<void>;
}

const mapStateToProps = (state: GlobalState, ownProps: RouterProps) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: RouterProps) => bindActionCreators({ signUp }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: Actions & RouterProps) => (
  withProps({
    handleSubmit: async (values: object) => {
      const password = get(values, 'password', '');

      await props.signUp(password);

      props.history.push('/new');
    }
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
)

export const Create = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(enhancer(CreateView));
