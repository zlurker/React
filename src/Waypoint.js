import React from 'react'; 

class Waypoint extends React.Component{
    render() {
        return (
          <button className="square" onClick={function() { alert('click'); }}>
            {this.props.value}
          </button>
        );
      }
}

export default Waypoint;