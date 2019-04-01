import * as React from "react";
import { List } from "semantic-ui-react";
import { OEP4TokenAmount } from "../api/tokenApi";
import { View } from "./view";

interface Props {
  tokens: OEP4TokenAmount[];
}

export const TokenAmountList: React.SFC<Props> = props => (
  <View>
    <List className="transferList" divided={true}>
      {props.tokens.map((token, i) => (
        <List.Item key={i}>
          <List.Icon name="money bill alternate outline" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>
              {token.amount} - {token.symbol}
            </List.Header>
            <List.Description>{token.name}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </View>
);
