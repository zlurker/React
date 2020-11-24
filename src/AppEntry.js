import React from 'react';
import Waypoint from './Waypoint.js';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import NumericField from './NumericField';

const requestOptions = {
    method: 'POST',
};

const NodeType = {
    Normal: "Normal",
    Obstacle: "Obstacle",
    Startpoint: "Startpoint",
    Endpoint: "Endpoint",
    Unvisited: "Unvisited",
    Visited: "Visited"
}


class AppEntry extends React.Component {

    constructor(props) {
        super(props);

        this.ClearAllNodeData = this.ClearAllNodeData.bind(this);
        this.ModifySettings = this.ModifySettings.bind(this);
        this.InitialiseNodeStatus = this.InitialiseNodeStatus.bind(this);
        this.SetNodeStatus = this.SetNodeStatus.bind(this);
        this.ChangeActionType = this.ChangeActionType.bind(this);
        this.BeginPathfinder = this.BeginPathfinder.bind(this);
        this.NodeStateChange = this.NodeStateChange.bind(this);
        this.GetCoordinates = this.GetCoordinates.bind(this);
        this.DistanceBetweenId = this.DistanceBetweenId.bind(this);
        this.PathfinderLoop = this.PathfinderLoop.bind(this);
        this.GetId = this.GetId.bind(this);
        this.InitialiseStartingData = this.InitialiseStartingData.bind(this);
        this.ModifyUnsavedSettings = this.ModifyUnsavedSettings.bind(this);
        this.SaveUnsavedSettings = this.SaveUnsavedSettings.bind(this);

        this.tempSettings = {};

        this.painterState = NodeType.Normal;
        this.settings = {};
        this.startNode = -1;
        this.endNode = -1;
        this.settingsLoaded = false;

        this.state = {
            triggerRender: 0
        }

        this.intervalId = 0;
    }

    ClearAllNodeData() {
        this.InitialiseNodeStatus();
        this.setState({ triggerRender: 0 });

        fetch('https://localhost:44391/RemoveAllNodes', requestOptions).then(response => response.json()).then(data => console.log(data));
    }

    InitialiseNodeStatus() {
        console.log("Initialising map for " + this.settings['X'] + " " + this.settings['Y']);
        this.nodeStatus = Array(this.settings['X'] * this.settings['Y']).fill(NodeType.Normal);
    }

    SetNodeStatus(id, state) {
        this.nodeStatus[id] = state;
        this.setState({ triggerRender: 0 });
    }

    ModifySettings(name, val) {
        if (isNaN(val))
            return;

        this.settings[name] = val;
        this.setState({ triggerRender: 0 });

        fetch('https://localhost:44391/ModifySettings?settingName=' + name + "&value=" + val, requestOptions).then(response => response.json()).then(data => console.log(data));
    }

    ModifyUnsavedSettings(name, val) {
        this.tempSettings[name] = val;
    }

    SaveUnsavedSettings() {
        for (let entry in this.tempSettings)
            this.ModifySettings(entry, this.tempSettings[entry]);

        this.ClearAllNodeData();
    }

    InitialiseStartingData() {

        if (this.explored != null)
            for (var i = 0; i < this.explored.length; i++)
                if (this.nodeStatus[this.explored[i]] == NodeType.Unvisited || this.nodeStatus[this.explored[i]] == NodeType.Visited)
                    this.SetNodeStatus([this.explored[i]], NodeType.Normal);

        this.currentNode = 0;
        this.unvisited = [];
        this.explored = [];
        this.cost = Array(this.settings['X'] * this.settings['Y']).fill([-1, 0]);
    }

    GetCoordinates(id) {
        var x = id % this.settings['Y'];
        var y = (id - x) / this.settings['Y'];

        return [x, y];
    }

    GetId(x, y) {
        console.log(x + " " +y);

        if (x < 0 || x >= this.settings['X'] || y < 0 || y >= this.settings['Y'])
            return -1;

        return (y * this.settings['Y']) + x;
    }

    ChangeActionType(evt) {
        this.painterState = evt;
    }

    SetNodeToNormal(nodeId) {
        if (nodeId < 0)
            return;

        this.SetNodeStatus([nodeId], NodeType.Normal);
        fetch('https://localhost:44391/RemoveNode?nodeId=' + nodeId, requestOptions).then(response => response.json()).then(data => console.log(data));
    }

    NodeStateChange(nodeid) {

        // Unsets previous SP/EP
        if (this.painterState == NodeType.Startpoint) {
            this.SetNodeToNormal(this.startNode);
            this.startNode = nodeid;
        }

        if (this.painterState == NodeType.Endpoint) {
            this.SetNodeToNormal(this.endNode);
            this.endNode = nodeid;
        }

        this.SetNodeStatus([nodeid], this.painterState);

        fetch('https://localhost:44391/SetNode?nodeId=' + nodeid + "&nodeState=" + this.painterState, requestOptions).then(response => response.json()).then(data => console.log(data));
    }

    DistanceBetweenId(id0, id1) {
        let coord0 = this.GetCoordinates(id0);
        let coord1 = this.GetCoordinates(id1);

        let x = Math.abs(coord1[0] - coord0[0]);
        let y = Math.abs(coord1[1] - coord0[1]);

        return (x * x) + (y * y);
    }

    PathfinderLoop() {
        console.log("Loop");

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

        this.setState({ triggerRender: 0 });
    }

    BeginPathfinder() {
        this.currentNode = this.startNode;
        this.unvisited = [];
        this.cost[this.currentNode] = [0, this.DistanceBetweenId(this.currentNode, this.endNode)];
        this.explored = [this.startNode];
        this.intervalId = setInterval(this.PathfinderLoop, this.settings["INTERVAL"]);
    }

    componentDidMount() {

        fetch('https://localhost:44391/RetrieveAllSettings', requestOptions).then(response => response.json()).then(data => {
            var settingsData = JSON.parse(data);

            for (var i = 0; i < settingsData.length; i++)
                this.settings[settingsData[i].SETTING_NAME] = settingsData[i].SETTING_VALUE;

            this.InitialiseNodeStatus();
            this.InitialiseStartingData();

            this.settingsLoaded = true;
            this.setState({ triggerRender: this.state.triggerRender++ });

            fetch('https://localhost:44391/RetrieveAllNodes', requestOptions).then(response => response.json()).then(data => {
                var nodesData = JSON.parse(data);

                for (var i = 0; i < nodesData.length; i++) {
                    switch (nodesData[i].NODE_TYPE) {
                        case NodeType.Startpoint:
                            this.startNode = nodesData[i].NODE_ID;
                            break;
                        case NodeType.Endpoint:
                            this.endNode = nodesData[i].NODE_ID;
                            break;

                    }

                    this.SetNodeStatus([nodesData[i].NODE_ID], nodesData[i].NODE_TYPE);
                }
            });
        });


    }

    render() {
        let nodes = [];

        var interval = '';
        var x = '';
        var y = '';

        if (this.settingsLoaded) {
            for (var i = 0; i < this.settings['X']; i++) {
                for (var j = 0; j < this.settings['Y']; j++) {
                    var id = this.GetId(i, j);
                    console.log(this.nodeStatus[id] + " " + id);
                    
                    nodes.push(<Waypoint callback={this.NodeStateChange} id={id} style={this.nodeStatus[id]} />);
                }

                nodes.push(<br></br>);
            }

            interval = this.settings['INTERVAL'].toString();
            x = this.settings['X'].toString();
            y = this.settings['Y'].toString();
        }

        return (
            <div className="App">
                <DropdownButton title='Paint' onSelect={this.ChangeActionType}>
                    <Dropdown.Item eventKey={NodeType.Normal}>Empty</Dropdown.Item>
                    <Dropdown.Item eventKey={NodeType.Endpoint}>Endpoint</Dropdown.Item>
                    <Dropdown.Item eventKey={NodeType.Startpoint}>Startpoint</Dropdown.Item>
                    <Dropdown.Item eventKey={NodeType.Obstacle}>Obstacle</Dropdown.Item>
                </DropdownButton>

                <NumericField startVal={x} settingName={'X'} callback={this.ModifyUnsavedSettings} />
                <NumericField startVal={y} settingName={'Y'} callback={this.ModifyUnsavedSettings} />
                <button onClick={this.SaveUnsavedSettings}>Set WH</button>
                <br></br>
                <NumericField startVal={interval} settingName={'INTERVAL'} callback={this.ModifySettings} />
                <br></br>

                <button onClick={this.BeginPathfinder}>
                    Visualize Pathfinder
                </button>
                <br></br>

                <button onClick={this.InitialiseStartingData}>
                    Clear Path Nodes
                </button>
                <br></br>

                <button onClick={this.ClearAllNodeData}>
                    Clear All Data
                </button>
                <br></br>

                {nodes}
            </div>
        );
    }
}

export default AppEntry;