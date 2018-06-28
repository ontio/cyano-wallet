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
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { Settings } from '../../api/settingsApi';
import { Filler, LogoHeader, Spacer, View } from '../../components';
import { required } from '../../utils/validate';

export interface Props {
  ontAmount: number;
  ongAmount: number;
  handleSave: (values: object) => Promise<void>;
  handleCancel: () => void;
  settings: Settings;
}

export type NetValues = 'TEST' | 'MAIN' | 'PRIVATE';

const netOptions: Array<{ text: string, value: NetValues }> = [
  {
    text: 'Test-Net',
    value: 'TEST'
  },
  {
    text: 'Main-Net',
    value: 'MAIN'
  },
  {
    text: 'Private-Net',
    value: 'PRIVATE'
  },
];

export const SettingsView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showSettings={false} title="Settings" />
      <View content={true} className="spread-around">
        <View>Wallet needs to be restarted for changes to take effect.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        initialValues={props.settings}
        onSubmit={props.handleSave}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View orientation="column">
              <label>Net</label>
              <Field
                name="net"
                validate={required}
                render={(t) => (
                  <SemanticForm.Dropdown
                    fluid={true}
                    selection={true}
                    options={netOptions}
                    onChange={(e, data) => t.input.onChange(data.value)}
                    value={t.input.value}
                    error={t.meta.touched && t.meta.invalid}
                  />
                )} />
            </View>
            {get(formProps.values, 'net') === 'PRIVATE' ? (
              <>
                <Spacer />
                <View orientation="column">
                  <label>Private node ip/address</label>
                  <Field
                    name="address"
                    validate={required}
                    render={(t) => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        placeholder="polaris1.ont.io"
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )} />
                </View>
                <Spacer />
                <View orientation="column">
                  <label>Use SSL</label>
                  <Field
                    name="ssl"
                    render={(t) => (
                      <SemanticForm.Checkbox
                        onChange={(e, d) => t.input.onChange(d.checked)}
                        checked={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )} />
                </View>
              </>) : (null)}
            <Filler />
            <View className="buttons">
              <Button icon="check" content="Save" />
              <Button onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )} />
    </View>
  </View>
);
