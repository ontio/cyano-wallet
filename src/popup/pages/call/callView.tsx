/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm, Icon, Popup } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';
import { gte, required } from '../../utils/validate';

export interface InitialValues {
  contract?: string;
  method?: string;
  paramsHash?: string;
  gasPrice?: string;
  gasLimit?: string;
}

export interface Props {
  allowWhitelist: boolean;
  initialValues: InitialValues;
  loading: boolean;
  locked: boolean;
  handleConfirm: (values: object) => Promise<void>;
  handleCancel: () => void;
}

export const CallView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="SC call" />
      <View content={true} className="spread-around">
        <View>Call to a smart contract.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} scroll={true}>
      <Form
        initialValues={props.initialValues}
        onSubmit={props.handleConfirm}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View className="scrollView">
              <View className="content">
                <View orientation="column">
                  <label>Contract</label>
                  <Field
                    name="contract"
                    validate={required}
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
                  <label>Method</label>
                  <Field
                    name="method"
                    validate={required}
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
                  <label>Parameters hash</label>
                  <Field
                    name="paramsHash"
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
                        disabled={props.loading}
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
                        disabled={props.loading}
                      />
                    )}
                  />
                </View>
                <Spacer />
                {props.allowWhitelist ? (
                  <View orientation="column">
                    <div>
                      <label>Whitelist this action</label>
                      <Popup
                        trigger={<Icon name="question circle outline" />}
                        content="Be responsible when using this functionality"
                      />
                    </div>
                    <Field
                      name="whitelist"
                      render={(t) => (
                        <SemanticForm.Checkbox
                          onChange={(e, d) => t.input.onChange(d.checked)}
                          checked={Boolean(t.input.value)}
                          error={t.meta.touched && t.meta.invalid}
                        />
                      )}
                    />
                  </View>
                  ) : (
                    <></>
                  )
                }
              </View>
            </View>
            <Filler />
            <Spacer />
            <View className="buttons">
              <Button disabled={props.loading} loading={props.loading} icon="check" content="Confirm" />
              <Button disabled={props.loading} onClick={props.handleCancel}>
                Cancel
              </Button>
            </View>
          </SemanticForm>
        )}
      />
    </View>
    <StatusBar />
  </View>
);
