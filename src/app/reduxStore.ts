
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { globalReducer } from './globalReducer';

// Connect our store to the reducers
export const reduxStore = createStore(globalReducer, composeWithDevTools(applyMiddleware(thunk)));

