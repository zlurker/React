import React from 'react';
import './Button.css'

class Waypoint extends React.Component {


  constructor(props) {
    super(props);
  } 

  render() {
    return (
      <button className="ButtonUI" onClick={function () { alert(window.$clickState); }}>
        {this.props.value}
      </button>
    );
  }
}

export default Waypoint;