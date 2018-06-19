import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader/logoHeader';
import { required, samePassword } from '../validate';
import { Filler, Spacer, View } from '../View';

export interface Props {
  handleSubmit: (values: object) => Promise<void>;
  handleCancel: () => void;
  loading: boolean;
}

export const ImportView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} title="Import private key" />
      <View content={true} className="spread-around">
        <View>Enter your private key and passphrase for wallet and identity encryption.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Form
        onSubmit={props.handleSubmit}
        validate={samePassword}
        render={(formProps) => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="signupForm">
            <View orientation="column">
              <label>Private key (WIF format)</label>
              <Field
                name="privateKey"
                validate={required}
                render={(t) => (
                  <SemanticForm.TextArea
                    rows={2}
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )} />
            </View>
            <Spacer />
            <View orientation="column">
              <label>Password</label>
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
                    disabled={props.loading}
                  />
                )} />
            </View>
            <Spacer />
            <View orientation="column">
              <label>Password again</label>
              <Field
                name="passwordAgain"
                render={(t) => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    icon="key"
                    type="password"
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )} />
            </View>
            <Filler />
            <View className="buttons">
              <Button disabled={props.loading} loading={props.loading}>Restore</Button>
              <Button disabled={props.loading} onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )} />
    </View>
  </View>
);
