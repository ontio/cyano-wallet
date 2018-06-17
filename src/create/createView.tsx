import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader';
import { Filler, Spacer, View } from '../View';

export interface Props {
  handleSubmit: (values: object) => Promise<void>;
}

export const CreateView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="New identity" />
      <View content={true} className="spread-around">
        <View>Enter your passphrase for wallet and identity encryption.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Form onSubmit={props.handleSubmit} render={(formProps) => (
        <SemanticForm onSubmit={formProps.handleSubmit} className="signupForm">
          <View orientation="column">
            <label>Password</label>
            <Field name="password" render={(t) => (
              <SemanticForm.Input
                onChange={t.input.onChange}
                input={{ ...t.input, value: t.input.value }}
                icon="key"
                type="password"
              />
            )} />
          </View>
          <Spacer />
          <View orientation="column">
            <label>Password again</label>
            <Field name="passwordAgain" render={(t) => (
              <SemanticForm.Input
                onChange={t.input.onChange}
                input={{ ...t.input, value: t.input.value }}
                icon="key"
                type="password"
              />
            )} />
          </View>
          <Filler />
          <View className="buttons">
            <Button>Sign up</Button>
          </View>
        </SemanticForm>
      )} />
    </View>
  </View>
);
