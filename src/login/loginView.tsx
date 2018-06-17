import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as SemanticForm } from 'semantic-ui-react';
import '../global.css';
import { Logo } from '../logo';
import { Filler, Spacer, View } from '../View';

export interface Props {
  handleSubmit: () => void;
}

export const LoginView: React.SFC<Props> = (props) => (
    <View orientation="column" fluid={true} className="gradient">
        <Logo/>
        <View orientation="column" className="hint">
          <View>To access your identity</View>
          <View>enter your password.</View>
        </View>
        <Spacer />
        <View orientation="column" fluid={true} content={true}>
          <Form onSubmit={props.handleSubmit} render={(formProps) => (
            <SemanticForm onSubmit={formProps.handleSubmit} className="loginForm">
              <Field name="password" render={(t) => (
                <SemanticForm.Input 
                  onChange={t.input.onChange} 
                  input={{ ...t.input, value: t.input.value }}
                  icon="key"
                  placeholder="Password"
                  size="mini"
                />
              )}/>
              <Filler />
              <View className="buttons">
                <Button size="mini">Sign in</Button>
              </View>
            </SemanticForm>
          )}/>
        </View>
    </View>
);
