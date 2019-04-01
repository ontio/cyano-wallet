import { get } from "lodash";
import * as React from "react";
import { Field, Form } from "react-final-form";
import { Button, Form as SemanticForm } from "semantic-ui-react";
import { Settings } from "../../api/settingsApi";
import { Filler, LogoHeader, Spacer, View } from "../../components";
import { required } from "../../utils/validate";

export interface Props {
  ontAmount: number;
  ongAmount: number;
  handleSave: (values: object) => Promise<void>;
  handleClear: () => void;
  handleCancel: () => void;
  handleExport: () => void;
  handleImport: (event: any) => void;
  handleTokenSettings: () => void;
  settings: Settings;
}

export type NetValues = "TEST" | "MAIN" | "PRIVATE";

const netOptions: Array<{ text: string; value: NetValues }> = [
  {
    text: "Test-Net",
    value: "TEST"
  },
  {
    text: "Main-Net",
    value: "MAIN"
  },
  {
    text: "Private-Net",
    value: "PRIVATE"
  }
];

export const SettingsView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} showSettings={false} title="Settings" />
      <View content={true} className="spread-around">
        <View>Wallet needs to be restarted for changes to take effect.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <Form
        initialValues={props.settings}
        onSubmit={props.handleSave}
        render={formProps => (
          <SemanticForm onSubmit={formProps.handleSubmit} className="sendForm">
            <View orientation="column">
              <label>Net</label>
              <Field
                name="net"
                validate={required}
                render={t => (
                  <SemanticForm.Dropdown
                    fluid={true}
                    selection={true}
                    options={netOptions}
                    onChange={(e, data) => t.input.onChange(data.value)}
                    value={t.input.value}
                    error={t.meta.touched && t.meta.invalid}
                  />
                )}
              />
            </View>
            {get(formProps.values, "net") === "PRIVATE" ? (
              <>
                <Spacer />
                <View orientation="column">
                  <label>Private node ip/address</label>
                  <Field
                    name="nodeAddress"
                    validate={required}
                    render={t => (
                      <SemanticForm.Input
                        onChange={t.input.onChange}
                        value={t.input.value}
                        placeholder="http://35.178.63.10"
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )}
                  />
                </View>
                <Spacer />
                <View orientation="column">
                  <label>Use SSL</label>
                  <Field
                    name="ssl"
                    render={t => (
                      <SemanticForm.Checkbox
                        onChange={(e, d) => t.input.onChange(d.checked)}
                        checked={t.input.value}
                        error={t.meta.touched && t.meta.invalid}
                      />
                    )}
                  />
                </View>
              </>
            ) : null}
            <Filler />
            <Spacer />
            <View className="buttons">
              <Button type="button" onClick={props.handleExport} content="Export wallet" />
              <span className="ui button">
                <label htmlFor="inputWallet" style={{ width: "100%" }}>
                  Import wallet
                </label>
                <input type="file" id="inputWallet" style={{ display: "none" }} onChange={props.handleImport} />
              </span>
            </View>
            <Spacer />
            {/* <Button type="button" onClick={props.handleTokenSettings} content="OEP-4 Tokens" /> */}
            <View className="buttons">
              <Button type="button" onClick={props.handleClear} content="Clear wallet" icon="delete" />
            </View>
            <Spacer />
            <View className="buttons">
              <Button icon="check" content="Save" />
              <Button onClick={props.handleCancel}>Cancel</Button>
            </View>
          </SemanticForm>
        )}
      />
    </View>
  </View>
);
