import $ from 'jquery';


const NodeType = {
  Normal: "Normal",
  Obstacle: "Obstacle",
  Startpoint: "Startpoint",
  Endpoint: "Endpoint",
  Unvisited: "Unvisited",
  Visited: "Visited"
}

function GetNodes() {

}

function SetNodes(id, nodetype) {

  console.log("setting node - ");

  const requestOptions = {
    method: 'POST',
  };

  fetch('https://localhost:44391/SetNode?nodeId=' + id + "&nodeState=" + nodetype, requestOptions).then(response => console.log(response)).catch(error=>console.log(error));
}



export { NodeType, SetNodes };