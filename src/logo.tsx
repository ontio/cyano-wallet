import * as React from 'react';
import './global.css';
import { View } from './View';

export const Logo: React.SFC<{}> = () => (
  <View orientation="column"> 
    <img className="logo" src={require('./assets/ontsymbol.png')} />
    <h1 className="header">Ontology ID & Wallet</h1>
  </View>
);
