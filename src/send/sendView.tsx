import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader';
import { Filler, Spacer, View } from '../View';

export interface Props {
  ontAmount: number;
  ongAmount: number;
  handleConfirm: (values: object) => Promise<void>;
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

export const SendView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="Send" />
      <View content={true} className="spread-around">
        <View>Double check the address of the recipient.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form onSubmit={props.handleConfirm} render={(formProps) => (
        <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
          <View orientation="column">
            <label>Recipient</label>
            <Field name="recipient" render={(t) => (
              <SemanticForm.Input
                fluid={true}
              />
            )} />
          </View>
          <Spacer />
          <View orientation="column">
            <label>Asset</label>
            <Field name="recipient" render={(t) => (
              <SemanticForm.Dropdown
                fluid={true}
                selection={true}
                options={assetOptions} 
                value="ONT"
              />
            )} />
          </View>
          <Spacer />
          <View orientation="column">
            <label>Amount</label>
            <Field name="amount" render={(t) => (
              <SemanticForm.Input
                fluid={true}
                type="number"
                placeholder="0.00"
                min="0"
              />
            )} />
          </View>
          <Filler />
          <View className="buttons">
            <Button icon="check" content="Confirm"/>
            <Button onClick={props.handleCancel}>Cancel</Button>
          </View>
        </SemanticForm>
      )} />
    </View>
  </View>
);
