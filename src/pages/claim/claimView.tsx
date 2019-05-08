import * as React from "react";
import { Button, Form as SemanticForm, Message, Segment } from "semantic-ui-react";
import { Filler, LogoHeader, View } from "../../components";
import { Field, Form } from "react-final-form";
import { samePassword, validMnemonics } from "../../utils/validate";
import { FormApi } from "final-form";
export interface Props {
  handleСonfirm: (values: object, formApi: FormApi) => Promise<object>;
  handleCancel: () => void;
  loading: boolean;
  currentAddress: string | undefined;
  balance: string | null;
  firstName: string;
  sureName: string;
  balanceError: string | null;
}

export const ClaimOnyxView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} title="Claim your coins" />
      <View content={true} className="spread-around" />
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Segment.Group compact={true}>
        <Segment>
          User: <span>{props.firstName}</span>
          <span style={{ paddingLeft: "5px" }}>{props.sureName}</span>
        </Segment>
        <Segment>
          Unclaimed balance: <span className="unclaimed-onyx-balance">{props.balance}</span>
          <span className="unclaimed-onyx-label">ONYX</span>
        </Segment>
      </Segment.Group>

      {props.balance && props.balance !== "0" ? (
        <Message color="orange">
          <p>
            Your Onyx coins will be claimed on address: <p><strong>{props.currentAddress}</strong></p>
          </p>
          <p>Make sure you remember or have written down your mnemonics phrase and private key.</p>
          <p>If you don't, you can possibly lose access to your money.</p>
        </Message>
      ) : null}

      <Form
        onSubmit={props.handleСonfirm}
        validate={samePassword}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="signupForm">
            <View orientation="column">
              <label>Please, enter mnemonics phrase for current account</label>
              <Field
                name="mnemonics"
                validate={validMnemonics}
                render={t => (
                  <SemanticForm.TextArea
                    rows={3}
                    onChange={t.input.onChange}
                    input={{ ...t.input, value: t.input.value }}
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading || !!props.balanceError}
                  />
                )}
              />
            </View>
            {formProps.submitError ? (
              <div className="error">{formProps.submitError}</div>
            ) : (
              !!props.balanceError && <div className="error">{props.balanceError}</div>
            )}
            <Filler />
            <View className="buttons">
              <Button
                disabled={props.loading || !!props.balanceError}
                loading={props.loading}
                role="submit"
                type="submit"
              >
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
