import React from 'react';
import App from './components/app';
import {store} from './model';

React.render(
  <App store={store} />,
  document.getElementById('app')
);
