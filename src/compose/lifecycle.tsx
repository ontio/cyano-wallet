import * as React from 'react';

type RenderMethod<S> = () => JSX.Element;

type Props = React.ComponentLifecycle<{}, {}>;

interface RenderProp<S> {
    render: RenderMethod<S>;
}

class Component<S> extends React.Component<Props & RenderProp<S>, {}> {
    constructor(props: Props & RenderProp<S>) {
        super(props);

        const {render, ...rest} = props;

        Object.assign(this, rest);
    }

    public render() {
        return this.props.render();
    }
}

export function lifecycle<S>(lifecycleProps: Props, render: RenderMethod<S>) {
    return (<Component {...lifecycleProps} render={render} />)
}
