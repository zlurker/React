import React from 'react';
import Waypoint from './Waypoint.js';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NodeType,SetNodes } from './Utils';

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

        this.xWidth = 10;
        this.yWidth = 10;

        this.painterState = NodeType.Normal;
        this.nodeStatus = Array(this.xWidth * this.yWidth).fill(NodeType.Normal);
        this.startNode = -1;
        this.endNode = -1;

        this.currentNode = 0;
        this.unvisited = [];
        this.explored = [];
        this.cost = Array(this.xWidth * this.yWidth).fill([-1, 0]);
        this.intervalId = 0;

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
        if (x < 0 || x >= this.xWidth || y < 0 || y >= this.yWidth)
            return -1;

        return (y * this.yWidth) + x;
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

        SetNodes(nodeid,this.painterState);
        this.setState({ iteration: this.state.iteration++ });
    }

    DistanceBetweenId(id0, id1) {
        let coord0 = this.GetCoordinates(id0);
        let coord1 = this.GetCoordinates(id1);

        let x = Math.abs(coord1[0] - coord0[0]);
        let y = Math.abs(coord1[1] - coord0[1]);

        return (x*x) + (y*y);
    }

    PathfinderLoop() {

        if (this.nodeStatus[this.currentNode] != NodeType.Startpoint && this.nodeStatus[this.currentNode] != NodeType.Endpoint)
            this.nodeStatus[this.currentNode] = NodeType.Visited;

        let nodeCoords = this.GetCoordinates(this.currentNode);
        let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

        for (let i = 0; i < directions.length; i++) {
            let id = this.GetId(nodeCoords[0] + directions[i][0], nodeCoords[1] + directions[i][1]);

            if (id < 0)
                continue;

            if (this.nodeStatus[id] != NodeType.Obstacle && (this.cost[id][0] > this.cost[this.currentNode][0] + 1 || this.cost[id][0] < 0 || !this.explored.includes(id))) {
                this.unvisited.push(id);
                this.explored.push(id);
                this.cost[id] = [this.cost[this.currentNode][0] + 1, this.DistanceBetweenId(id, this.endNode)];


                if (this.nodeStatus[id] != NodeType.Startpoint && this.nodeStatus[id] != NodeType.Endpoint)
                    this.nodeStatus[id] = NodeType.Unvisited;
            }
        }

        if (this.unvisited.length > 0) {
            let shortestDist = this.cost[this.unvisited[0]][0] + this.cost[this.unvisited[0]][1];
            let shortestIndex = 0;

            for (let i = 1; i < this.unvisited.length; i++) {
                let dist = this.cost[this.unvisited[i]][0] + this.cost[this.unvisited[i]][1];

                if (dist < shortestDist) {
                    shortestIndex = i;
                    shortestDist = dist;
                }
            }

            this.currentNode = this.unvisited[shortestIndex];
            this.unvisited.splice(shortestIndex, 1);

            if (this.currentNode == this.endNode)
                clearInterval(this.intervalId);
        } else
            clearInterval(this.intervalId);

        this.setState({ iteration: this.state.iteration++ });
    }

    BeginPathfinder() {
        this.currentNode = this.startNode;
        this.unvisited = [];
        this.cost[this.currentNode] = [0, this.DistanceBetweenId(this.currentNode, this.endNode)];
        this.explored = [this.startNode];
        this.intervalId = setInterval(this.PathfinderLoop, 50);
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