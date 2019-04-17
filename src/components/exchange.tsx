import * as React from "react";
import { Button } from "semantic-ui-react";
import { View } from "./view";

interface Props {
  amount: 0;
  handleExchange: () => void;
}

export const Exchange: React.SFC<Props> = props => {
  return <View>
    <input type="number" placeholder={props.amount.toString()}/>
    <Button
      onClick={props.handleExchange}
      content="Exchange"
      compact={true}
    />
  </View>;
};

