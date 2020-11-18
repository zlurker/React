import React from 'react'; 
import './Button.css'

class Waypoint extends React.Component{
    render() {
        return (          
          <button className="ButtonUI" onClick={function() { alert('click'); }}>
            {this.props.value}
          </button>
        );
      }
}

export default Waypoint;