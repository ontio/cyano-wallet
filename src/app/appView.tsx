/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The ONT Detective.
 *
 * The ONT Detective is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ONT Detective is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ONT Detective.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Clear } from '../clear/clear';
import { Create } from '../create/create';
import { Dashboard } from '../dashboard/dashboard';
import { Home } from '../home/home';
import { Import } from '../import/import';
import { Login } from '../login/login';
import { New } from '../new/new';
import { Receive } from '../receive/receive';
import { Restore } from '../restore/restore';
import { Send } from '../send/send';
import { SendConfirm } from '../sendConfirm/sendConfirm';
import { Signup } from '../signup/signup';
import { WalletChecker } from '../walletChecker';
import { reduxStore } from './reduxStore';

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
