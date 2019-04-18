import * as React from "react";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { Filler, LogoHeader, View } from "../../components";
import { Field, Form } from "react-final-form";
import { /* required,  */ samePassword, validMnemonics } from "../../utils/validate";
import { FormApi } from "final-form";
export interface Props {
  handleСonfirm: (values: object, formApi: FormApi) => Promise<object>;
  handleCancel: () => void;
  loading: boolean;
  currentAddress: string | undefined;
  balance: string | null;
}
/* 
  account address
  balance
  mnemonic phrase
*/
export const ClaimOnyxView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} title="Claim your coins" />
      <View content={true} className="spread-around">
        <View>Your Onyx coins will be claimed on address: {props.currentAddress}</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <h1>
        User: <span>Gideon W</span>
      </h1>
      <h1>
        Unclaimed balance: <span>{props.balance}</span>
      </h1>
      <Form
        onSubmit={props.handleСonfirm}
        validate={samePassword}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="signupForm">
            <View orientation="column">
              <label>Mnemonics phrase for current account</label>
              <Field
                name="mnemonics"
                validate={validMnemonics}
                render={t => (
                  <SemanticForm.TextArea
                    rows={3}
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )}
              />
            </View>
            {formProps.submitError && <div className="error">{formProps.submitError}</div>}
            <Filler />
            <View className="buttons">
              <Button disabled={props.loading} loading={props.loading} role="submit" type="submit">
                Claim
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
