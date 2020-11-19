const NodeType={
    Normal: "Normal",
    Obstacle: "Obstacle",
    Startpoint: "Startpoint",
    Endpoint:"Endpoint",
    Unvisited:"Unvisited",
    Visited:"Visited"
  }

var xWidth =10;
var yWidth =10;

function test(){
  console.log("Test 123456789");
} 


function GetCoordinates(id){
  var x= id % yWidth;
  var y = (id -x)/yWidth;
  
  return [x,y];
}

function GetId(x,y){
  return (y * yWidth) + x;
}



export {NodeType,GetCoordinates,GetId};