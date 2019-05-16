import React from 'schedulit/src/node_modules/react';
import ReactDOM from 'schedulit/src/node_modules/react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
