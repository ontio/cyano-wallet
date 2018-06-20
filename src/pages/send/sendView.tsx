import { get } from 'lodash';
import * as React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { Filler, LogoHeader, Spacer, View } from '../../components';
import { required } from '../../utils/validate';

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
      <LogoHeader showLogout={true} title="Send" />
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
              validate={required}
              render={(t) => (
                <SemanticForm.Input
                  type="number"
                  placeholder={get(formProps.values, 'asset') === 'ONG' ? '0.0000000000' : '0'}
                  min="0"
                  max={get(formProps.values, 'asset') === 'ONG' ? props.ongAmount : props.ontAmount}
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
  </View>
);
