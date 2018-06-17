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
import { Dashboard } from '../dashboard/dashboard';
import { Home } from '../home/home';
import { Login } from '../login/login';
import { New } from '../new/new';
import { Send } from '../send/send';
import { Signup } from '../signup/signup';
import { reduxStore } from './reduxStore';

export const AppView: React.SFC<{}> = () => (
  <Provider store={reduxStore}>
    <Router>
      <>
        <Route path="/" exact={true} component={Home} />
        <Route path="/new" exact={true} component={New} />
        <Route path="/dashboard" exact={true} component={Dashboard} />
        <Route path="/login" exact={true} component={Login} />
        <Route path="/sign-up" exact={true} component={Signup} />
        <Route path="/send" exact={true} component={Send} />
      </>
    </Router>
  </Provider>
);
