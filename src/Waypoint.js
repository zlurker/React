import React from 'react';
import './Button.css'

class Waypoint extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      style: "Normal"
    }
  }

  changeColor() {
    this.setState({ style: window.$clickState })
  }

  render() {

    return (
      <button className={this.state.style} onClick={this.changeColor.bind(this)}>
      </button>
    );
  }
}

export default Waypoint;