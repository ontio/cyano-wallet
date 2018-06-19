import * as React from 'react';
import { RouterProps } from 'react-router';
import { hasStoredWallet } from '../auth/authApi';
import { lifecycle } from "../compose";


const enhancer = (Component: React.ComponentType<{}>) => (props: RouterProps) => (
  lifecycle({
    componentDidMount: async () => {
      const result = await hasStoredWallet();

      if (result) {
        props.history.push('/login');
      } else {
        props.history.push('/sign-up');
      }
    }
  }, () => (
    <Component />
  ))
);

export const Home = enhancer(() => null);
