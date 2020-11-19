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

  changeColor(event) {
    this.props.callback(this.props.id);
    this.setState({ style: window.$clickState })
  }

  render() {

    console.log("Rendering");
    return (
      <button className={this.state.style} onMouseDown={this.changeColor}>
      </button>
    );
  }
}

export default Waypoint;