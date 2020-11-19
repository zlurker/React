import React from 'react';
import Waypoint from './Waypoint.js';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NodeType } from './Utils';

class AppEntry extends React.Component {

    constructor(props) {
        super(props);

        this.ChangeActionType = this.ChangeActionType.bind(this);
        this.BeginPathfinder = this.BeginPathfinder.bind(this);
        this.NodeStateChange = this.NodeStateChange.bind(this);
        this.GetCoordinates = this.GetCoordinates.bind(this);
        this.GetId = this.GetId.bind(this);      

        this.NodeStatus = [];
        this.xWidth = 10;
        this.yWidth = 10;

        this.state = {
            style: "Normal"
        }
    }

    GetCoordinates(id) {
        var x = id % this.yWidth;
        var y = (id - x) / this.yWidth;

        return [x, y];
    }

    GetId(x, y) {
        return (y * this.yWidth) + x;
    }

    ChangeActionType(evt) {
        window.$clickState = evt;
    }

    NodeStateChange(nodeid) {
        console.log("Called by nodeid" + this.GetCoordinates(nodeid));
    }

    BeginPathfinder() {

    }

    render() {
        let nodes = [];

        var x = 10;
        var y = 10;

        for (var i = 0; i < y; i++) {
            for (var j = 0; j < x; j++)
                nodes.push(<Waypoint callback={this.NodeStateChange} id={this.GetId(j, i)} />);

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