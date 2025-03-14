import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return React.createElement(
    'div',
    {id: 'app'},
    'Hello React 18'
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);