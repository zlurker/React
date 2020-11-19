import React from 'react';
import Waypoint from './Waypoint.js';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NodeType } from './Utils';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class AppEntry extends React.Component {

    constructor(props) {
        super(props);

        this.ChangeActionType = this.ChangeActionType.bind(this);
        this.BeginPathfinder = this.BeginPathfinder.bind(this);
        this.NodeStateChange = this.NodeStateChange.bind(this);
        this.GetCoordinates = this.GetCoordinates.bind(this);
        this.DistanceBetweenId = this.DistanceBetweenId.bind(this);
        this.PathfinderLoop = this.PathfinderLoop.bind(this);
        this.GetId = this.GetId.bind(this);
        

        this.xWidth = 15;
        this.yWidth = 15;

        this.painterState = NodeType.Normal;
        this.nodeStatus = Array(this.xWidth * this.yWidth).fill(NodeType.Normal);
        this.startNode = -1;
        this.endNode = -1;

        this.currentNode = 0;
        this.unvisited = [];
        this.explored = [];

        this.state = {
            iteration: 0
        }
    }

    GetCoordinates(id) {
        var x = id % this.yWidth;
        var y = (id - x) / this.yWidth;

        return [x, y];
    }

    GetId(x, y) {
        let id = (y * this.yWidth) + x;

        if (id >= this.yWidth * this.xWidth)
            id = -1;

        return id;
    }

    ChangeActionType(evt) {
        this.painterState = evt;
    }

    NodeStateChange(nodeid) {

        // Unsets previous SP/EP
        if (this.painterState == NodeType.Startpoint) {
            if (this.startNode > -1)
                this.nodeStatus[this.startNode] = NodeType.Normal;

            this.startNode = nodeid;
        }

        if (this.painterState == NodeType.Endpoint) {
            if (this.endNode > -1)
                this.nodeStatus[this.endNode] = NodeType.Normal;

            this.endNode = nodeid;
        }

        this.nodeStatus[nodeid] = this.painterState;
        this.setState({ iteration: this.state.iteration++ });
    }

    DistanceBetweenId(id0, id1) {
        let coord0 = this.GetCoordinates(id0);
        let coord1 = this.GetCoordinates(id1);

        return Math.abs(coord1[0] - coord0[0]) + Math.abs(coord1[1] - coord0[1]);
    }

    PathfinderLoop() {
        this.nodeStatus[this.currentNode] = NodeType.Visited;

        let nodeCoords = this.GetCoordinates(this.currentNode);
        let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

        for (let i = 0; i < directions.length; i++) {
            let id = this.GetId(nodeCoords[0] + directions[i][0], nodeCoords[1] + directions[i][1]);

            if (id > -1 && !this.explored.includes(id)) {
                this.unvisited.push(id);
                this.explored.push(id);
                this.nodeStatus[id] = NodeType.Unvisited;
            }
        }

        if (this.unvisited.length > 0) {
            let shortestDist = this.DistanceBetweenId(this.unvisited[0], this.currentNode);
            let shortestIndex = 0;

            for (let i = 1; i < this.unvisited.length; i++) {
                let dist = this.DistanceBetweenId(this.unvisited[i], this.currentNode);

                if (dist < shortestDist){
                    shortestIndex = i;
                    shortestDist = dist;
                }
            }
           
            this.currentNode = this.unvisited[shortestIndex];
            this.unvisited.splice(shortestIndex,1);
        }


        this.setState({ iteration: this.state.iteration++ });
    }

    BeginPathfinder() {
        this.currentNode = this.startNode;
        this.unvisited = [];
        this.explored = [];
        setInterval(this.PathfinderLoop, 200);
    }

    render() {
        let nodes = [];

        for (var i = 0; i < this.yWidth; i++) {
            for (var j = 0; j < this.xWidth; j++) {
                var id = this.GetId(j, i);
                nodes.push(<Waypoint callback={this.NodeStateChange} id={id} style={this.nodeStatus[id]} />);
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