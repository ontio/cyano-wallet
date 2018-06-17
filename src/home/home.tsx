import * as React from 'react';
import { RouterProps } from 'react-router';
import { hasStoredWallet } from '../auth/authActions';
import { lifecycle } from "../compose";


const enhancer = (Component: React.ComponentType<{}>) => (props: RouterProps) => (
  lifecycle({
    componentDidMount: async () => {
      const result = await hasStoredWallet();

      if (result) {
        props.history.push('/dashboard');
      } else {
        props.history.push('/dashboard');
      }
    }
  }, () => (
    <Component />
  ))
);

export const Home = enhancer(() => null);
