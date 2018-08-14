import * as H from 'history';
import createTransitionManager, { TransitionManager } from 'history/createTransitionManager';
import Actions from '../redux/actions';
import { GlobalStore } from '../redux/state';
import { RouterState } from './router';

export { createLocation } from 'history';

export function createKey() {
    return Math.random().toString(36).substr(2, 6);
}

type getUserConfirmationType = (message: string, callback: (result: boolean) => void) => void;

/**
 * Implementation of History for React Router using underlying Redux store 
 * for getting state and dispatching actions.
 * 
 * Inspired by Memory router from React Router.
 */
export class ReduxHistory implements H.History {
    private store: GlobalStore;
    private state: RouterState;
    private transitionManager: TransitionManager;
    private getUserConfirmation: getUserConfirmationType;

    constructor(store: GlobalStore, getUserConfirmation: getUserConfirmationType = (() => true)) {
        this.state = store.getState().router;
        this.store = store;
        this.transitionManager = createTransitionManager();
        this.getUserConfirmation = getUserConfirmation;
    }

    public get index(): number {
        return this.state.index;
    }

    public get entries(): H.Location[] {
        return this.state.entries;
    }

    public get length(): number {
        return this.state.entries.length;
    }

    public get location(): H.Location {
        return this.state.entries[this.state.index];
    }

    public get action(): H.Action {
        return this.state.action;
    }

    public dispatchChange() {
        this.store.dispatch(
            Actions.router.setRouterState(this.entries, this.index, this.action)
        );

        this.transitionManager.notifyListeners(this.location, this.action);
    }

    public push(path: H.Path | H.LocationDescriptorObject, state?: H.LocationState): void {
        const action = 'PUSH';
        const location = H.createLocation(path, state, createKey(), this.location);

        this.transitionManager.confirmTransitionTo(
            location,
            action,
            this.getUserConfirmation,
            ok => {
                if (!ok) {
                    return;
                }

                const prevIndex = this.index;
                const nextIndex = prevIndex + 1;

                const nextEntries = this.entries.slice(0);
                if (nextEntries.length > nextIndex) {
                    nextEntries.splice(
                        nextIndex,
                        nextEntries.length - nextIndex,
                        location
                    );
                } else {
                    nextEntries.push(location);
                }

                this.state.entries = nextEntries;
                this.state.index = nextIndex;
                this.state.action = action;

                this.dispatchChange();
            }
        );
    }
    public replace(path: H.Path | H.LocationDescriptorObject, state?: H.LocationState): void {
        const action = 'REPLACE';
        const location = H.createLocation(path, state, createKey(), this.location);

        this.transitionManager.confirmTransitionTo(
            location,
            action,
            this.getUserConfirmation,
            ok => {
                if (!ok) {
                    return;
                }

                this.entries[this.index] = location;
                this.state.action = action;

                this.dispatchChange();
            }
        );
    }

    public go(n: number): void {
        const nextIndex = this.clamp(this.index + n, 0, this.entries.length - 1);

        const action = 'POP';
        const location = this.entries[nextIndex];

        this.transitionManager.confirmTransitionTo(
            location,
            action,
            this.getUserConfirmation,
            ok => {
                if (ok) {
                    this.state.index = nextIndex;
                    this.state.action = action;
                    this.dispatchChange();
                } else {
                    // Mimic the behavior of DOM histories by
                    // causing a render after a cancelled POP.
                    this.dispatchChange();
                }
            }
        );
    }
    public goBack(): void {
        return this.go(-1);
    }
    public goForward(): void {
        return this.go(1);
    }

    public block(prompt?: boolean | string | H.TransitionPromptHook): H.UnregisterCallback {
        if (typeof prompt === 'string') {
            prompt = Boolean(prompt);
        }
        return this.transitionManager.setPrompt(prompt);
    }
    public listen(listener: H.LocationListener): H.UnregisterCallback {
        return this.transitionManager.appendListener(listener);
    }
    public createHref(location: H.LocationDescriptorObject): H.Href {
        return H.createPath(location);
    }

    private clamp(n: number, lowerBound: number, upperBound: number) {
        return Math.min(Math.max(n, lowerBound), upperBound);
    }
}
