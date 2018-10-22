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
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';
import { required } from '../../utils/validate';

export interface Props {
  loading: boolean;
  handleConfirm: (values: object) => Promise<void>;
  handleCancel: () => void;
}

export const TokenSettingsAddView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Add OEP-4 token" />
      <View content={true} className="spread-around">
        <View>Enter token script hash.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        onSubmit={props.handleConfirm}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View className="scrollView">
              <View className="content">
                <View orientation="column">
                  <label>Script hash</label>
                  <Field
                    name="contract"
                    validate={required}
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                        disabled={props.loading}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
            <Filler />
            <Spacer />
            <View className="buttons">
              <Button icon="check" content="Confirm" disabled={props.loading} loading={props.loading}  />
              <Button disabled={props.loading} onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )}
      />
    </View>
    <StatusBar />
  </View>
);
