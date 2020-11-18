import logo from './logo.svg';
import './App.css';
import Waypoint from './Waypoint.js';
import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import NodeType from './Utils';

var nodes = [];

function ChangeActionType(evt) {

  window.$clickState = evt;
}

function BeginPathfinder() {
  App();
}

// Use this as purely entry point?
function App() {
  nodes = [];

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      nodes.push(<Waypoint></Waypoint>);
    }

    nodes.push(<br></br>);
  }

  return (
    <div className="App">
      <DropdownButton title='Paint' onSelect={ChangeActionType}>
        <Dropdown.Item eventKey={NodeType.Normal}>Empty</Dropdown.Item>
        <Dropdown.Item eventKey={NodeType.Endpoint}>Endpoint</Dropdown.Item>
        <Dropdown.Item eventKey={NodeType.Startpoint}>Startpoint</Dropdown.Item>
        <Dropdown.Item eventKey={NodeType.Obstacle}>Obstacle</Dropdown.Item>
      </DropdownButton>

      <button onClick={BeginPathfinder}>
        Visualize Pathfinder
      </button><br></br>

      {nodes}

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
