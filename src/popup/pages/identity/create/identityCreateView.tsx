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
import { required, samePassword } from '../../../utils/validate';

export interface Props {
  handleSubmit: (values: object) => Promise<void>;
  handleCancel: () => void;
  loading: boolean;
  haveEnoughOng: boolean;
}

export const IdentityCreateView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="New identity" />
      <View content={true} className="spread-around">
        <View>Enter your passphrase for identity encryption. Registration will cost you 0.01 ONG.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      {!props.haveEnoughOng ? (
        <Message>You do not have enough ONG (0.01 ONG required).</Message>
      ) : (null)}
      <Form
        onSubmit={props.handleSubmit}
        validate={samePassword}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="signupForm">
            <View orientation="column">
              <label>Identity password</label>
              <Field
                name="password"
                validate={required}
                render={(t) => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    icon="key"
                    type="password"
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading || !props.haveEnoughOng}
                  />
                )} />
            </View>
            <Spacer />
            <View orientation="column">
              <label>Identity password again</label>
              <Field
                name="passwordAgain"
                render={(t) => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    icon="key"
                    type="password"
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading || !props.haveEnoughOng}
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
              <Button disabled={props.loading || !props.haveEnoughOng} loading={props.loading}>Create</Button>
              <Button disabled={props.loading} onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )} />
    </View>
    <StatusBar />
  </View>
);
