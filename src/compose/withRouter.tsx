import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

type RenderMethod<S> = (routerProps: RouteComponentProps<any>) => JSX.Element;

interface Props<S> {
  render: RenderMethod<S>;
};

class Component<S> extends React.Component<Props<S>, S> {
  constructor(props: Props<S>) {
    super(props);
  }

  public render() {
    return (
      <Route children={this.props.render} />
    );
  }

  public getState() {
    return this.state;
  }
}

export function withRouter<S>(render: RenderMethod<S>) {
  return (<Component render={render} />)
}
