import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const pingServer = () => {
    fetch('/api/ping')
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={pingServer}>Ping</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and your changes will live-update automatically.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
