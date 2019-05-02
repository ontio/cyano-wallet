import * as React from "react";
import { Button, Message } from "semantic-ui-react";
import { AccountLogoHeader, Filler, Spacer, View } from "../../components";

export interface Props {
  loading: boolean;
  contract: string;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

export const TokenSettingsDelView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="OEP-4 token remove" />
      <View content={true} className="spread-around">
        <View>Confirm token removal.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <label>OEP-4 token</label>
      <Message>{props.contract}</Message>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button disabled={props.loading} onClick={props.handleCancel}>
          Cancel
        </Button>
        <Button
          icon="check"
          disabled={props.loading}
          loading={props.loading}
          onClick={props.handleConfirm}
          content="Confirm"
        />
      </View>
    </View>
  </View>
);
