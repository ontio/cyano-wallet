import * as React from 'react';
import { Button } from 'semantic-ui-react';
import '../global.css';
import { View } from '../View';

export interface Props {
  title: string;
  handleLogout: () => void;
  showLogout: boolean;
}

export const LogoHeaderView: React.SFC<Props> = (props) => (
  <View className="logoHeader">
    <img height="30" src={require('../assets/ontsymbol.png')} />
    <h1>{props.title}</h1>
    {props.showLogout ? <View orientation="column" fluid={true} className="buttons">
      <Button onClick={props.handleLogout} className="close" size="big" compact={true} basic={true} icon="shutdown" />
    </View> : null }
  </View>
);
