import React from 'react';
import './Button.css'

class Waypoint extends React.Component {


  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className={this.props.style} onClick={()=>{this.props.callback(this.props.id)}}>
      </button>
    );
  }
}

export default Waypoint;