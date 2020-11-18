import React from 'react';
import './Button.css'

class Waypoint extends React.Component {


  constructor(props) {
    super(props);

    this.changeColor = this.changeColor.bind(this);
    this.state = {
      style: "Normal"
    }
  }

  changeColor() {
    this.setState({ style: window.$clickState })
  }

  render() {

    return (
      <button className={this.state.style} onClick={this.changeColor}>
      </button>
    );
  }
}

export default Waypoint;