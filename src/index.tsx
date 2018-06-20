import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './global.css';

import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { WalletChecker } from './components';
import { Clear, Create, Dashboard, Home, Import, Login, New, Receive, Restore, Send, SendConfirm, Signup } from './pages';
import { reduxStore } from './redux';

export const AppView: React.SFC<{}> = () => (
  <Provider store={reduxStore}>
    <Router>
      <>
        <WalletChecker />
        <Route path="/dashboard" exact={true} component={Dashboard} />
        <Route path="/send" exact={true} component={Send} />
        <Route path="/sendConfirm" exact={true} component={SendConfirm} />
        <Route path="/receive" exact={true} component={Receive} />

        <Route path="/" exact={true} component={Home} />
        <Route path="/new" exact={true} component={New} />
        <Route path="/clear" exact={true} component={Clear} />
        <Route path="/restore" exact={true} component={Restore} />
        <Route path="/import" exact={true} component={Import} />
        <Route path="/create" exact={true} component={Create} />
        <Route path="/login" exact={true} component={Login} />
        <Route path="/sign-up" exact={true} component={Signup} />
      </>
    </Router>
  </Provider>
);

ReactDOM.render(
  <AppView />,
  document.getElementById('root') as HTMLElement
);
