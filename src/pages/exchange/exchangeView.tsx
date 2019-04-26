import * as React from "react";
import { Field, Form, FormRenderProps } from "react-final-form";
import { Button, Form as SemanticForm, Segment } from "semantic-ui-react";
import { Filler, LogoHeader, Spacer, View } from "../../components";
import { range } from "../../utils/validate";
import { convertOxgToOnyx } from "../../utils/number";

export interface Props {
  ontAmount: number;
  handleConfirm: (values: object) => Promise<void>;
  handleMax: (formProps: FormRenderProps) => void;
  handleCancel: () => void;
  exhangeRate: string | null;
  maxOxgAmount: string;
}

export const ExchangeView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Exchange" />
      <View content={true} className="spread-around">
        <View>Here you can exchange your ONYX to OXG</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        onSubmit={props.handleConfirm}
        render={formProps => {
          return (
            <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
              <Segment.Group compact={true}>
                <Segment>
                  <div>
                    Exchange rate:
                    <span className="exch-container">
                      {props.exhangeRate ? (
                        <>
                          <span className="exch-amount">1</span>
                          <span className="exch-coin">OXG</span>
                          <span style={{ marginRight: "3px" }}>=</span>
                          <span className="exch-amount">{props.exhangeRate}</span>
                          <span className="exch-coin">ONYX</span>
                        </>
                      ) : (
                        <span>n/a</span>
                      )}
                    </span>
                  </div>
                </Segment>
                <Segment>
                  You will give:
                  <span className="exch-container">
                    {formProps.values.amount ? (
                      <>
                        <span className="exch-amount">
                          {convertOxgToOnyx(formProps.values.amount, props.exhangeRate)}
                        </span>
                        <span className="exch-coin">ONYX</span>
                      </>
                    ) : (
                      <span>n/a</span>
                    )}
                  </span>
                </Segment>
              </Segment.Group>
              <View orientation="column">
                <label>OXG amount you will get</label>
                <Field
                  name="amount"
                  validate={range(0, Number(props.maxOxgAmount))}
                  render={t => (
                    <SemanticForm.Input
                      type="number"
                      placeholder="0.000000000"
                      step="0.000000001"
                      onChange={t.input.onChange}
                      input={{ ...t.input, value: t.input.value }}
                      error={t.meta.touched && t.meta.invalid}
                      disabled={!props.exhangeRate}
                      action={
                        <Button
                          type="button"
                          onClick={() => props.handleMax(formProps)}
                          content="MAX"
                        />
                      }
                    />
                  )}
                />
              </View>
              <Spacer />
              <Filler />
              <View className="buttons">
                <Button icon="check" content="Confirm" disabled={!props.exhangeRate} />
                <Button onClick={props.handleCancel}>Cancel</Button>
              </View>
            </SemanticForm>
          );
        }}
      />
    </View>
  </View>
);
