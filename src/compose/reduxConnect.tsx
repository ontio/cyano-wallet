import * as equal from 'fast-deep-equal';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Dispatch, Store, Unsubscribe } from 'redux';

type RenderMethod<S, A> = (reduxProps: S, actions: A, getReduxProps: () => S) => JSX.Element;

interface OuterProps<P, A> {
  render: RenderMethod<P, A>;
};

interface Props<S, P, A> extends OuterProps<P, A> {
  mapStateToProps: StateToPropsMethod<S, P>;
  mapDispatchToProps: DispatchToPropsMethod<A>;
};

const subscriptionShape = PropTypes.shape({
  isSubscribed: PropTypes.func.isRequired,
  notifyNestedSubs: PropTypes.func.isRequired,
  trySubscribe: PropTypes.func.isRequired,
  tryUnsubscribe: PropTypes.func.isRequired
});

const storeShape = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
});

function observeStore<S, P>(store: Store, select: StateToPropsMethod<S, P>, onChange: (currentState: P) => void) {
  let currentState: P;

  function handleChange() {
    const nextState = select(store.getState());
    if (!equal(currentState, nextState)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

class Component<S, P, A> extends React.Component<Props<S, P, A>, {}> {
  public static contextTypes = {
    store: storeShape,
    storeSubscription: subscriptionShape,
  };

  public context: {
    store: Store;
  }

  public unsubscribe: Unsubscribe;

  constructor(props: Props<S, P, A>) {
    super(props);
  }

  public render() {
    const { render, mapDispatchToProps } = this.props;
    const store = this.context.store;

    const a = mapDispatchToProps(store.dispatch);
    
    const getReduxState = this.getReduxState.bind(this);
    return render(getReduxState(), a, getReduxState);
  }

  public getReduxState() {
    const { mapStateToProps } = this.props;
    const store = this.context.store;
    const p = mapStateToProps(store.getState());
    return p;
  }

  public componentDidMount() {
    this.unsubscribe = observeStore(this.context.store, this.props.mapStateToProps, this.stateChanged.bind(this));
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public stateChanged() {
    this.forceUpdate();
  }
}

type StateToPropsMethod<S, P> = (globalState: S) => P;
type DispatchToPropsMethod<T> = (dispatch: Dispatch) => T;

export function reduxConnect<S, P, A>(mapStateToProps: StateToPropsMethod<S, P>, mapDispatchToProps: DispatchToPropsMethod<A>, render: RenderMethod<P, A>) {
  return (<Component render={render} mapStateToProps={mapStateToProps} mapDispatchToProps={mapDispatchToProps} />)
}

export function dummy() {
  return {};
}
