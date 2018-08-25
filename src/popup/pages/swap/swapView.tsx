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
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Button, Form as SemanticForm, Message } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, StatusBar, View } from '../../components';
import { gt } from '../../utils/validate';

export interface InitialValues {
  amount?: string;
}

export interface Props {
  initialValues: InitialValues;
  locked: boolean;
  handleConfirm: (values: object) => Promise<void>;
  handleMax: (formProps: FormRenderProps) => void;
  handleCancel: () => void;
}

export const SwapView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Swap NEP-5 ONT tokens" />
      <View content={true} className="spread-around">
        <View>Only whole number of ONT is possible to swap.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Message>Swap can take upto 24h. Try with small amount first.</Message>
      <Form
        initialValues={props.initialValues}
        onSubmit={props.handleConfirm}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View orientation="column">
              <label>Amount</label>
              <Field
                name="amount"
                validate={gt(0)}
                render={(t) => (
                  <SemanticForm.Input
                    type="number"
                    placeholder="0"
                    step="1"
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.locked}
                    action={<Button type="button" onClick={() => props.handleMax(formProps)} content="MAX" />}
                  />
                )}
              />
            </View>
            <Filler />
            <View className="buttons">
              <Button icon="check" content="Confirm" />
              <Button onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )}
      />
    </View>
    <StatusBar />
  </View>
);
