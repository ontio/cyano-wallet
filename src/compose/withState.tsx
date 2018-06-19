import * as React from 'react';

type RenderMethod<S> = (state: S, setState: (state: S) => void, getState: () => S) => JSX.Element;

interface Props<S> {
    defaultState: S;
    render: RenderMethod<S>;
};

class Component<S> extends React.Component<Props<S>, S> {
    constructor(props: Props<S>) {
        super(props);
        this.state = props.defaultState;
    }

    public render() {
        return this.props.render(this.state, this.setState.bind(this), this.getState.bind(this));
    }

    public getState() {
        return this.state;
    }
}

export function withState<S>(defaultState: S, render: RenderMethod<S>) {
    return (<Component defaultState={defaultState} render={render} />)
}
