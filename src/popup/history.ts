import { ReduxHistory } from '../redux/reduxHistory';
import { GlobalStore } from '../redux/state';

let history: ReduxHistory;

export function initHistory(store: GlobalStore) {
    history = new ReduxHistory(store);
    return history;
}

export function getHistory() {
    return history;
}
