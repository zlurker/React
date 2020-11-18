import React from 'react';
import Waypoint from './Waypoint.js';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import NodeType from './Utils';

class AppEntry extends React.Component {

    constructor(props) {
        super(props);

        this.ChangeActionType = this.ChangeActionType.bind(this);
        this.BeginPathfinder = this.BeginPathfinder.bind(this);

        this.state = {
            style: "Normal"
        }
    }

    ChangeActionType(evt) {
        window.$clickState = evt;
    }

    BeginPathfinder() {
       
    }

    render() {
        let nodes = [];

        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                nodes.push(<Waypoint></Waypoint>);
            }

            nodes.push(<br></br>);
        }

        return (
            <div className="App">
                <DropdownButton title='Paint' onSelect={this.ChangeActionType}>
                    <Dropdown.Item eventKey={NodeType.Normal}>Empty</Dropdown.Item>
                    <Dropdown.Item eventKey={NodeType.Endpoint}>Endpoint</Dropdown.Item>
                    <Dropdown.Item eventKey={NodeType.Startpoint}>Startpoint</Dropdown.Item>
                    <Dropdown.Item eventKey={NodeType.Obstacle}>Obstacle</Dropdown.Item>
                </DropdownButton>

                <button onClick={this.BeginPathfinder}>
                    Visualize Pathfinder
            </button><br></br>

                {nodes}
            </div>
        );
    }
}

export default AppEntry;