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
import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from 'src/redux/state';
import { reduxConnect, withProps } from '../../compose';
import { Actions } from '../../redux';
import { Props, TrustedScsDelView } from './trustedScsDelView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      delTrustedSc: Actions.settings.delTrustedSc,
      finishLoading: Actions.loader.finishLoading,
      startLoading: Actions.loader.startLoading,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const contract: string = get(props.location, 'state.contract');

    return withProps(
      {
        contract,
        handleCancel: async () => {
          props.history.goBack();
        },
        handleConfirm: async () => {
          await actions.startLoading();

          await actions.delTrustedSc(contract);
          await actions.finishLoading();

          props.history.push('/settings/trusted');
        },
        loading: reduxProps.loading,
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const TrustedScsDel = enhancer(TrustedScsDelView);
