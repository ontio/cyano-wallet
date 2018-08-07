
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
import * as React from 'react';
import { withProps, withRouter } from '../../compose';
import { LogoHeaderView, Props } from './logoHeaderView';

interface OuterProps {
  showSettings?: boolean;
  showAccount?: boolean;
  showIdentity?: boolean;
  title: string;
}


const enhancer = (Component: React.ComponentType<Props>) => (props: OuterProps) => (
  withRouter(routerProps => (
    withProps({
      handleAccount: () => {
        routerProps.history.push('/');
      },
      handleIdentity: () => {
        routerProps.history.push('/identity');
      },
      handleSettings: () => {
        routerProps.history.push('/settings');
      }
    }, (injectedProps) => (
      <Component {...injectedProps} title={props.title} 
        showSettings={props.showSettings !== undefined ? props.showSettings : true} 
        showAccount={props.showAccount === true} 
        showIdentity={props.showIdentity === true} 
      />
    ))
  ))
);

export const LogoHeader = enhancer(LogoHeaderView);

interface TitleOuterProps {
  title: string;
}

export const IdentityLogoHeader = (props: TitleOuterProps) => (
  <LogoHeader showAccount={true} showSettings={true} title={props.title} />
);

export const AccountLogoHeader = (props: TitleOuterProps) => (
  <LogoHeader showIdentity={true} showSettings={true} title={props.title} />
);