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
import { gte } from '../../utils/validate';

export interface InitialValues {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  email?: string;
  needStorage?: boolean;
  gasPrice?: string;
  gasLimit?: string;
}

export interface Props {
  initialValues: InitialValues;
  locked: boolean;
  handleConfirm: (values: object) => Promise<void>;
  handleCancel: () => void;
}

export const DeployView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="SC deploy" />
      <View content={true} className="spread-around">
        <View>Deploy a smart contract.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        initialValues={props.initialValues}
        onSubmit={props.handleConfirm}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View className="scrollView">
              <View className="content">
                <View orientation="column">
                  <label>Name</label>
                  <Field
                    name="name"
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                        disabled={props.locked}
                      />
                    )}
                  />
                </View>
                <Spacer />

                <View orientation="column">
                  <label>Version</label>
                  <Field
                    name="version"
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                        disabled={props.locked}
                      />
                    )}
                  />
                </View>
                <Spacer />

                <View orientation="column">
                  <label>Description</label>
                  <Field
                    name="description"
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                        disabled={props.locked}
                      />
                    )}
                  />
                </View>
                <Spacer />

                <View orientation="column">
                  <label>Author</label>
                  <Field
                    name="author"
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                        disabled={props.locked}
                      />
                    )}
                  />
                </View>
                <Spacer />

                <View orientation="column">
                  <label>Email</label>
                  <Field
                    name="email"
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                        disabled={props.locked}
                      />
                    )}
                  />
                </View>
                <Spacer />

                <View orientation="column">
                  <label>Need storage</label>
                  <Field
                    name="needStorage"
                    render={(t) => (
                      <SemanticForm.Checkbox
                        onChange={(e, d) => t.input.onChange(d.checked)}
                        checked={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )}
                  />
                </View>

                <View orientation="column">
                  <label>Gas price</label>
                  <Field
                    name="gasPrice"
                    validate={gte(0)}
                    render={(t) => (
                      <SemanticForm.Input
                        type="number"
                        placeholder={'500'}
                        step={'0.00000000001'}
                        onChange={t.input.onChange}
                        input={{ ...t.input, value: t.input.value }}
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )}
                  />
                </View>
                <Spacer />
                <View orientation="column">
                  <label>Gas limit</label>
                  <Field
                    name="gasLimit"
                    validate={gte(0)}
                    render={(t) => (
                      <SemanticForm.Input
                        type="number"
                        placeholder={'30000'}
                        step={'0.00000000001'}
                        onChange={t.input.onChange}
                        input={{ ...t.input, value: t.input.value }}
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
            <Filler />
            <Spacer />
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
