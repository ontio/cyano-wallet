import * as React from 'react';
import { Button } from 'semantic-ui-react';
import '../global.css';
import { Logo } from '../logo';
import { Spacer, View } from '../View';

export interface Props {
  handleSubmit: (values: object) => Promise<void>;
}

export const SignupView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true} className="gradient">
    <Logo />
    <View orientation="column" className="hint">
      <View>To start using Ontology</View>
      <View>create new identity or import existing.</View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" fluid={true} className="center">
        <Spacer />
        <Button size="mini">New identity</Button>
        <Spacer />
        <Button size="mini">Restore identity</Button>
        <Spacer />
        <Button size="mini">Import private key</Button>
      </View>
    </View>
  </View>
);
