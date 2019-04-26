import * as React from 'react';
import { LogoHeader, View, Spacer } from '../../components';
import { Field, Form } from "react-final-form";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { required } from "../../utils/validate";

export interface Props {
  mnemonics: string;
  handleConfirm: (data) => void;
}

export const confirmCreateView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} title="Confirm mnemonics phrase" />
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">

    <Form
        onSubmit={props.handleConfirm}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View orientation="column">
              <label>Mnemonics phrase</label>
              <Field
                name="mnemonics"
                validate={required}
                render={t => (
                  <SemanticForm.Input
                    onChange={t.input.onChange}
                    value={t.input.value}
                    error={t.meta.touched && t.meta.invalid}
                  />
                )}
              />
            </View>
            <Spacer/>
            <Spacer/>
            <Spacer/>
            <View className="buttons">
              <Button icon="check" content="Confirm" />
              {/* <Button onClick={props.handleCancel}>Cancel</Button> */}
            </View>
          </SemanticForm>
        )}
      />
 
    </View>
  </View>
);
