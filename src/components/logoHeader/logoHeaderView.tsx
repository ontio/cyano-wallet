import * as React from "react";
import { Button } from "semantic-ui-react";
import { View } from "../view";

export interface Props {
  title: string;
  handleSettings: () => void;
  handleAccounts: () => void;
  handleInvestorLogin: () => void;
  showSettings: boolean;
  showAccounts: boolean;
}

export const LogoHeaderView: React.SFC<Props> = props => (
  <header>
    <View className="logoHeader space-betweem">
      <View>
        <img height="30" src={require("../../assets/logo-main.png")} />
        <span>Onyx Wallet</span>
      </View>

      <View orientation="row" className="buttons">
        {props.showAccounts ? (
          <>
            <Button
              onClick={props.handleInvestorLogin}
              size="big"
              compact={true}
              basic={true}
              icon="angle double down"
              data-tooltip="Claim your investments"
              data-position="bottom right"
            />
            <Button
              onClick={props.handleAccounts}
              size="big"
              compact={true}
              basic={true}
              icon="users"
              data-tooltip="Change account"
              data-position="bottom right"
            />
          </>
        ) : null}
        {props.showSettings ? (
          <Button
            onClick={props.handleSettings}
            size="big"
            compact={true}
            basic={true}
            icon="cog"
            data-tooltip="Settings"
            data-position="bottom right"
          />
        ) : null}
      </View>
    </View>
    <View className="justify-center">
      <h1>{props.title}</h1>
    </View>
  </header>
);
