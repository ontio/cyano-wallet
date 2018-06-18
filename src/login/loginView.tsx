import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import { Error } from '../error';
import '../global.css';
import { Logo } from '../logo';
import { required } from '../validate';
import { Filler, Spacer, View } from '../View';

export interface Props {
  handleSubmit: (values: object) => Promise<object>;
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
                  placeholder="Password"
                  error={t.meta.touched && t.meta.invalid}
                  disabled={props.loading}
                />
              )} />
            <Error show={formProps.submitFailed} message="Failed to login." />
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
