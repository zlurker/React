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
    this.setState({ style: window.$clickState })
  }

  render() {
    return (
      <button className={this.props.style} onClick={()=>{this.props.callback(this.props.id)}}>
      </button>
    );
  }
}

export default Waypoint;