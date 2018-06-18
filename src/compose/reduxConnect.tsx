import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Dispatch } from 'redux';

type RenderMethod<S, A> = (state: S, actions: A) => JSX.Element;

interface OuterProps<P, A> {
    render: RenderMethod<P, A>;
};

interface Props<P, A> extends OuterProps<P, A> {
    [key: string]: any;
};

class Component<P, A> extends React.Component<Props<P, A>, {}> {
    constructor(props: Props<P, A>) {
        super(props);
    }

    public render() {
        const { render, children, ...rest } = this.props;
        return this.props.render(rest as P, rest as A);
    }
}

type StateToPropsMethod<S, P> = (globalState: S) => P;
type DispatchToPropsMethod<T> = (dispatch: Dispatch) => T;

export function reduxConnect<S, P, A>(mapStateToProps: StateToPropsMethod<S, P>, mapDispatchToProps: DispatchToPropsMethod<A>, render: RenderMethod<P, A>) {
    
    const ComposedComponent = compose<Props<P, A>, OuterProps<P, A>>(
        connect(mapStateToProps, mapDispatchToProps)
    ) (Component);

    return (<ComposedComponent render={render} />)
}
