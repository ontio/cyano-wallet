import * as React from 'react';
import { View } from './View';

interface Props {
  onClick: () => void;
}

export const Clickable: React.SFC<Props> = (props) => (
  <View>
    <div className="clickable" onClick={props.onClick}>{props.children}</div>
  </View>
);

