import * as React from "react";
import { Button } from "semantic-ui-react";
import { Transfer } from "../../redux/runtime";
import { /* Clickable, */ Filler, LogoHeader, /* Spacer, */ View } from "../../components";
// import { TransferList } from "../../components/transferList";

export interface Props {
  ontAmount: string;
  ongAmount: string;

  unboundAmount: string;
  ownAddress: string;
  transfers: Transfer[] | null;
  handleSend: () => void;
  handleTransfers: () => void;
  handleReceive: () => void;
  handleWithdraw: () => void;
}

export const DashboardView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Balances" />
      <View content={true} className="spread-around balance-container">
        <View orientation="column" className="balance onyx-balance-column">
          <label className="balance-label">ONYX</label>
          <h1 className="onyx-balance-amount">{props.ontAmount}</h1>
        </View>
        <View orientation="column" className="balance">
          <label className="balance-label">OXG</label>
          <h3>{props.ongAmount}</h3>
          <h4
            onClick={props.handleWithdraw}
            className="unbound"
            data-tooltip="Unbound OXG"
            data-position="bottom center"
          >
            {props.unboundAmount} (Claim)
          </h4>
        </View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      {/* <h1>Last transfers</h1>
      <Spacer />
      <TransferList ownAddress={props.ownAddress} transfers={props.transfers} />
      <Spacer />
      <View className="center">
        <Clickable onClick={props.handleTransfers}>more</Clickable>
      </View> */}
      <Filler />
      <View className="buttons">
        <Button icon="send" content="Send" onClick={props.handleSend} />
        <Button icon="inbox" content="Receive" onClick={props.handleReceive} />
      </View>
    </View>
  </View>
);
