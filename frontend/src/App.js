// frontend/src/App.js
import logo from "./logo.svg";
import "./App.css";
import React, { useEffect } from "react";

function App() {
  const fetchData = async () => {
    const res = await fetch(process.env.REACT_APP_BACKEND_URL);
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
