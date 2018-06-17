import * as React from 'react';
import './global.css';
import { View } from './View';

export interface Props {
  title: string;
}

export const LogoHeader: React.SFC<Props> = (props) => (
    <View className="logoHeader">
      <img height="30" src={require('./assets/ontsymbol.png')} />
      <h1>{props.title}</h1>
    </View>
);
