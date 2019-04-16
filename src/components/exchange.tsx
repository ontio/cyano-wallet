import * as React from "react";
import { View } from "./view";

interface Props {
  amount: 0
}

export const Exchange: React.SFC<Props> = props => {
  return <View>
    <input type="number" placeholder={props.amount.toString()}/>
    <button type="submit">Exchange</button>
  </View>;
};

