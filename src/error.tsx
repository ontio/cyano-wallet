import * as React from 'react';
import { View } from './View';

interface Props {
  show: boolean;
  message: string;
}

export const Error: React.SFC<Props> = (props) => {
  if (props.show) {
    return (
      <View orientation="column" className="center error">
        <View>{props.message}</View>
      </View>
    );
  } else {
    return null;
  }
};
