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
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';
import { range, required } from '../../utils/validate';

export interface Props {
  ontAmount: number;
  ongAmount: number;
  handleConfirm: (values: object) => Promise<void>;
  handleMax: (formProps: FormRenderProps) => void;
  handleCancel: () => void;
}

const assetOptions = [
  {
    text: 'ONT',
    value: 'ONT'
  },
  {
    text: 'ONG',
    value: 'ONG'
  },
];

/**
 * todo: amount number step does not work for ONG, should be changed to custom validation
 */
export const SendView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Send" />
      <View content={true} className="spread-around">
        <View>Double check the address of the recipient.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form onSubmit={props.handleConfirm} render={(formProps) => (
        <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
          <View orientation="column">
            <label>Recipient</label>
            <Field
              name="recipient"
              validate={required}
              render={(t) => (
                <SemanticForm.Input
                  onChange={t.input.onChange}
                  value={t.input.value}
                  error={t.meta.touched && t.meta.invalid}
                />
              )} />
          </View>
          <Spacer />
          <View orientation="column">
            <label>Asset</label>
            <Field
              name="asset"
              validate={required}
              render={(t) => (
                <SemanticForm.Dropdown
                  fluid={true}
                  selection={true}
                  options={assetOptions}
                  onChange={(e, data) =>  t.input.onChange(data.value)}
                  value={t.input.value}
                  error={t.meta.touched && t.meta.invalid}
                />
              )} />
          </View>
          <Spacer />
          <View orientation="column">
            <label>Amount</label>
            <Field
              name="amount"
              validate={range(0, get(formProps.values, 'asset') === 'ONG' ? props.ongAmount : props.ontAmount)}
              render={(t) => (
                <SemanticForm.Input
                  type="number"
                  placeholder={get(formProps.values, 'asset') === 'ONG' ? '0.0000000000' : '0'}
                  step={get(formProps.values, 'asset') === 'ONG' ? '0.00000000001' : '1'}
                  onChange={t.input.onChange}
                  input={{ ...t.input, value: t.input.value }}
                  error={t.meta.touched && t.meta.invalid}
                  disabled={get(formProps.values, 'asset') === undefined}
                  action={(<Button type='button' onClick={() => props.handleMax(formProps)} content="MAX" />)}
                />
              )} />
          </View>
          <Filler />
          <View className="buttons">
            <Button icon="check" content="Confirm" />
            <Button onClick={props.handleCancel}>Cancel</Button>
          </View>
        </SemanticForm>
      )} />
    </View>
    <StatusBar />
  </View>
);
