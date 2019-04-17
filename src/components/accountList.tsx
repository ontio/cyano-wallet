import * as React from "react";
import { List } from "semantic-ui-react";

interface Props {
  accounts: string[];
  selectedAccount: string;
  onClick: (account: string) => void;
  onDel: (account: string) => void;
}

export const AccountList: React.SFC<Props> = props => (
  <>
    <List className="accountList" divided={true}>
      {props.accounts.map((account, i) => (
        <List.Item key={i} onClick={e => props.onClick(account)}>
          <List.Icon
            name="times circle outline"
            size="large"
            verticalAlign="middle"
            style={{ cursor: "pointer" }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              props.onDel(account);
            }}
          />
          <List.Content verticalAlign="middle">
            {account === props.selectedAccount ? <List.Header>{account}</List.Header> : <span>{account}</span>}
          </List.Content>
        </List.Item>
      ))}
    </List>
  </>
);
