import * as React from "react";
import { List } from "semantic-ui-react";
import { OEP4TokenAmount } from "../api/tokenApi";

interface Props {
  tokens: OEP4TokenAmount[];
}

export const TokenAmountList: React.SFC<Props> = props => (
  <>
    <h3>OEP-4 tokens</h3>
    <List className="transferList oep-4" divided={true}>
      {props.tokens && props.tokens.length ? (
        props.tokens.map((token, i) => (
          <List.Item key={i}>
            <List.Icon name="money bill alternate outline" size="large" verticalAlign="middle" />
            <List.Content>
              <List.Header>
                {token.amount} - {token.symbol}
              </List.Header>
              <List.Description>{token.name}</List.Description>
            </List.Content>
          </List.Item>
        ))
      ) : (
        <h5 className="no-tokens">No tokens are available for this account...</h5>
      )}
    </List>
  </>
);
