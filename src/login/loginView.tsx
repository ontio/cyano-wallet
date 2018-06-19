import { FormApi } from 'final-form';
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { Clickable } from '../clickableText';
import '../global.css';
import { Logo } from '../logo';
import { required } from '../validate';
import { Filler, Spacer, View } from '../View';

export interface Props {
  handleSubmit: (values: object, formApi: FormApi) => Promise<object>;
  handleClear: () => void;
  loading: boolean;
}

export const LoginView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true} className="gradient">
    <Logo />
    <View orientation="column" className="hint">
      <View>To access your identity</View>
      <View>enter your password.</View>
    </View>
    <Spacer />
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Form onSubmit={props.handleSubmit} render={(formProps) => (
        <SemanticForm
          onSubmit={formProps.handleSubmit}
          className="loginForm"
        >
          <View orientation="column">
            <Field
              name="password"
              validate={required}
              render={(t) => (
                <SemanticForm.Input
                  onChange={t.input.onChange}
                  input={{ ...t.input, value: t.input.value }}
                  icon="key"
                  type="password"
                  placeholder={formProps.submitFailed ? 'Failed to login' : 'Password'}
                  error={t.meta.touched && t.meta.invalid}
                  disabled={props.loading}
                />
              )} />
          </View>
          <View orientation="column" className="center clearAccount">
            <View>
              <View>or&nbsp;</View>
              <Clickable onClick={props.handleClear}>clear</Clickable>
              <View>&nbsp;stored identity.</View>
            </View>
          </View>
          <Filler />
          <View className="buttons">
            <Button disabled={props.loading} loading={props.loading}>Sign in</Button>
          </View>
        </SemanticForm>
      )} />
    </View>
  </View>
);
