import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { AppView } from './app/appView';
import './index.css';

ReactDOM.render(
  <AppView />,
  document.getElementById('root') as HTMLElement
);
