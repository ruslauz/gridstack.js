import React from 'react';
import ReactDOM from 'react-dom/client';

import Example from './components/Example';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<Example />);
