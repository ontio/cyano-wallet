import * as React from "react";
import { Button } from "semantic-ui-react";
import { View } from "../view";

export interface Props {
  handleSettings: () => void;
}
export const LogoView: React.SFC<Props> = props => (
  <View orientation="column" className="logo">
    <View className="spread">
      <Button size="big" compact={true} basic={true} icon="cog" className="hidden" />
      <img src={require("../../assets/logo-main.png")} />
      <Button onClick={props.handleSettings} size="big" compact={true} basic={true} icon="cog" />
    </View>
    <h1 className="header">OnyxChain Web Wallet</h1>
  </View>
);
