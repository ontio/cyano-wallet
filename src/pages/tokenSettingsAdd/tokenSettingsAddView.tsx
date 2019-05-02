import * as React from "react";
import { Field, Form } from "react-final-form";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { AccountLogoHeader, Filler, Spacer, View } from "../../components";
import { tokenValid } from "../../utils/validate";

export interface Props {
  loading: boolean;
  handleConfirm: (values: object) => Promise<object>;
  handleCancel: () => void;
}

export const TokenSettingsAddView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Add OEP-4 token" />
      <View content={true} className="spread-around">
        <View>Enter token script hash.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        onSubmit={props.handleConfirm}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View className="column">
              <label>Script hash</label>
              <Field
                name="contract"
                validate={tokenValid}
                render={t => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    value={t.input.value}
                    error={t.meta.touched && t.meta.invalid}
                    disabled={props.loading}
                  />
                )}
              />
            </View>
            <Filler />
            <Spacer />
            <View className="buttons">
              <Button disabled={props.loading} onClick={props.handleCancel}>
                Cancel
              </Button>
              <Button icon="check" content="Confirm" disabled={props.loading} loading={props.loading} />
            </View>
          </SemanticForm>
        )}
      />
    </View>
  </View>
);
