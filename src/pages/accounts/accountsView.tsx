import * as React from "react";
import { Button } from "semantic-ui-react";
import { AccountList, AccountLogoHeader, Filler, Spacer, View } from "../../components";

export interface Props {
  loading: boolean;
  accounts: string[];
  selectedAccount: string;

  handleAdd: () => void;
  handleBack: () => void;

  handleAccountClick: (account: string) => void;
  handleAccountDelClick: (account: string) => void;
}

export const AccountsView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Accounts" />
      <View content={true} className="spread-around">
        <View>Select the account to switch to.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <View orientation="column" className="scrollView">
        <AccountList
          accounts={props.accounts}
          selectedAccount={props.selectedAccount}
          onClick={props.handleAccountClick}
          onDel={props.handleAccountDelClick}
        />
      </View>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="add" content="Add" onClick={props.handleAdd} loading={props.loading} disabled={props.loading} />
        <Button content="Back" onClick={props.handleBack} disabled={props.loading} />
      </View>
    </View>
  </View>
);
