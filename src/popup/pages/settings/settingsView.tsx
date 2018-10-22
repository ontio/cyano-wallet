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
import * as FileReaderInput from 'react-file-reader-input';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { NetValue, SettingsState } from '../../../redux/settings';
import { Filler, LogoHeader, Spacer, StatusBar, View } from '../../components';
import { required } from '../../utils/validate';

export interface Props {
  handleSave: (values: object) => Promise<void>;
  handleCancel: () => void;
  handleClear: () => void;
  handleClearIdentity: () => void;

  handleExport: () => void;

  handleImport: (event: React.SyntheticEvent<{}>, results: FileReaderInput.Result[]) => void;

  handleTokenSettings: () => void;
  
  settings: SettingsState;
  enableClear: boolean;
  enableClearIdentity: boolean;
}

const netOptions: Array<{ text: string, value: NetValue }> = [
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
      <LogoHeader showSettings={false} title="Settings" />
      <View content={true} className="spread-around">
        <View>Backup your wallet before clearing.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        initialValues={props.settings}
        onSubmit={props.handleSave}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View className="scrollView">
              <View className="content">
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
                  <Spacer />
                  <Button 
                    disabled={!props.enableClear} onClick={props.handleClear} 
                    icon="delete" title="Clear account and identity" content="Clear wallet" 
                  />
                  <Spacer />
                  <Button 
                    disabled={!props.enableClearIdentity} onClick={props.handleClearIdentity} 
                    icon="user delete" title="Clear only identity" content="Clear identity" 
                  />
                  <Spacer />
                  <Button 
                    type="button"
                    disabled={!props.enableClear} onClick={props.handleExport} 
                    content="Export wallet" 
                  />
                  <Spacer />
                  <FileReaderInput onChange={props.handleImport} as="text">
                    <Button
                      type="button"
                      fluid={true}
                      content="Import wallet" 
                    />
                  </FileReaderInput>
                  <Spacer />
                  <Button 
                    type="button"
                    onClick={props.handleTokenSettings} 
                    content="OEP-4 Tokens" 
                  />
                </View>
              </View>  
            <Filler />
            <Spacer />
            <View className="buttons">
              <Button icon="check" content="Save" />
              <Button onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )} />
    </View>
    <StatusBar />
  </View>
);
