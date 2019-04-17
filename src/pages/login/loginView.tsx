import * as React from "react";
import { Field, Form } from "react-final-form";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { Filler, LogoHeader, Spacer, View } from "../../components";
import { required } from "../../utils/validate";

export interface Props {
  handleSubmit: (values: object) => Promise<void>;
  handleCancel: () => void;
  loading: boolean;
}

export const LoginView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} title="Investor account" />
      <View content={true} className="spread-around">
        <View>Enter your username and password from https://ico.onyxcoin.io site to log in as an investor.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Form
        onSubmit={props.handleSubmit}
        // validate={samePassword}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="loginForm">
            <View orientation="column">
              <label>Username</label>
              <Field
                name="username"
                validate={required}
                render={t => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    icon="user"
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )}
              />
            </View>
            <Spacer />
            <View orientation="column">
              <label>Password</label>
              <Field
                name="password"
                validate={required}
                render={t => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    icon="key"
                    type="password"
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )}
              />
            </View>
            <Filler />
            <View className="buttons">
              <Button disabled={props.loading} loading={props.loading} role="submit" type="submit">
                Log in
              </Button>
              <Button disabled={props.loading} onClick={props.handleCancel}>
                Cancel
              </Button>
            </View>
          </SemanticForm>
        )}
      />
    </View>
  </View>
);
