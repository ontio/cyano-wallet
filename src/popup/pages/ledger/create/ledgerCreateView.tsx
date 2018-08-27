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
import { Button, Form as SemanticForm, Message } from 'semantic-ui-react';
import { Filler, LogoHeader, Spacer, StatusBar, View } from '../../../components';
import { required } from '../../../utils/validate';

export interface InitialValues {
  index: string;
  neo: boolean;
}

export interface Props {
  handleSubmit: (values: object) => Promise<void>;
  handleCancel: () => void;
  initialValues: InitialValues;
  loading: boolean;
}

export const LedgerCreateView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="New Ledger account" />
      <View content={true} className="spread-around">
        <View>Choose your address.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Form
        initialValues={props.initialValues}
        onSubmit={props.handleSubmit}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="signupForm">
            <View orientation="column">
              <label>Index</label>
              <Message>Enter account index. Every index will generate unique account. Default is 0.</Message>
              <Field
                name="index"
                validate={required}
                render={(t) => (
                  <SemanticForm.Input
                    type="number"
                    min="0"
                    max="255"
                    step="1"
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )} />
            </View>
            <Spacer />
            <View orientation="column">
              <label>NEO compatible</label>
              <Field
                name="neo"
                render={(t) => (
                  <SemanticForm.Checkbox
                    onChange={(e, d) => t.input.onChange(d.checked)}
                    checked={t.input.value}
                    error={t.meta.touched && t.meta.invalid}
                  />
                )} />
            </View>
            <Filler />
            <View className="buttons">
              <Button disabled={props.loading} loading={props.loading}>Sign up</Button>
              <Button disabled={props.loading} onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )} />
    </View>
    <StatusBar />
  </View>
);
