import * as React from "react";
import { Button } from "semantic-ui-react";
import { Transfer } from "../../redux/runtime";
import { LogoHeader, View } from "../../components";
import { TransferList } from "../../components/transferList";

export interface Props {
  ownAddress: string;
  transfers: Transfer[] | null;
  handleBack: () => void;
}

export const TransfersView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Transfers" />
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around transfersContainer">
      <View orientation="column" className="transfersView">
        <TransferList ownAddress={props.ownAddress} transfers={props.transfers} />
      </View>
      <View className="buttons">
        <Button content="Back" onClick={props.handleBack} />
      </View>
    </View>
  </View>
);
