/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './global.css';

import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { WalletChecker } from './components';
import { Clear, Create, Dashboard, Home, Import, Login, New, Receive, Restore, Send, SendComplete, SendConfirm, SendFailed, Signup, Transfers } from './pages';
import { reduxStore } from './redux';

export const AppView: React.SFC<{}> = () => (
  <Provider store={reduxStore}>
    <Router>
      <>
        <WalletChecker />
        <Route path="/dashboard" exact={true} component={Dashboard} />
        <Route path="/send" exact={true} component={Send} />
        <Route path="/sendConfirm" exact={true} component={SendConfirm} />
        <Route path="/sendComplete" exact={true} component={SendComplete} />
        <Route path="/sendFailed" exact={true} component={SendFailed} />
        <Route path="/receive" exact={true} component={Receive} />
        <Route path="/transfers" exact={true} component={Transfers} />

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
