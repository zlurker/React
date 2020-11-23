import React from 'react';
import './Button.css'

class InputForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        this.props.callback(this.state.value);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }

    /* constructor(props) {
       super(props);
     }
   
     render() {
       return (
         <button className={this.props.style} onClick={()=>{this.props.callback(this.props.id)}}>
         </button>
       );
     }*/
}

export default InputForm;