import logo from './logo.svg';
import './App.css';
import Waypoint from './Waypoint.js';
import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  var arrButtons = [];

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      arrButtons.push(<Waypoint></Waypoint>);
    }
    arrButtons.push(<br></br>);
  }

  return (
    <div className="App">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Dropdown Button
  </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {arrButtons}
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
          Learn react
        </a>
      </header>
    </div>
  );
}

export default App;
