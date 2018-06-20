import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { Transfer } from '../../api/explorerApi';
import { Filler, LogoHeader, Spacer, View } from '../../components';
import { TransferList } from '../../components/transferList';

export interface Props {
  ownAddress: string;
  transfers: Transfer[] | null;
  handleBack: () => void;
}

export const TransfersView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="partSmall gradient">
      <LogoHeader showLogout={true} title="Transfers" />
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <View className="transfersView">
        <TransferList ownAddress={props.ownAddress} transfers={props.transfers} />
      </View>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="send" content="Back" onClick={props.handleBack} />
      </View>
    </View>
  </View>
);
