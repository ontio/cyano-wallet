import * as React from "react";
import { Button } from "semantic-ui-react";
import { Filler, LogoHeader, View } from "../../components";

export interface Props {
  handleСonfirm: () => void;
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
      <div>
        Unclaimed balance: <span>{props.balance}</span>
      </div>
      <Filler />
      <View className="buttons">
        <Button disabled={props.loading} loading={props.loading} role="submit" type="submit">
          Claim
        </Button>
        <Button disabled={props.loading} onClick={props.handleCancel}>
          Cancel
        </Button>
      </View>
    </View>
  </View>
);
