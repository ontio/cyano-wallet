import * as React from "react";
import { Button } from "semantic-ui-react";
import { TokenState } from "../../redux/settings/settingsReducer";
import { Filler, LogoHeader, Spacer, TokenList, View } from "../../components";

export interface Props {
  tokens: TokenState[];
  handleAdd: () => void;
  handleDel: (contract: string) => void;
  handleBack: () => void;
}

export const TokenSettingsView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="OEP-4 Tokens" />
      <View content={true} className="spread-around">
        <View>Manage OEP-4 tokens.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <View orientation="column" className="scrollView">
        <TokenList tokens={props.tokens} onDel={props.handleDel} />
      </View>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="add" content="Add" onClick={props.handleAdd} />
        <Button content="Back" onClick={props.handleBack} />
      </View>
    </View>
  </View>
);
