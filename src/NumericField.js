import React from 'react';

class NumericField extends React.Component{

    constructor(props){
        super(props);

        this.ValueChange = this.ValueChange.bind(this);

        this.state = {
            textVal:props.startVal
        }
    }

    ValueChange(evt){
        this.setState({textVal:evt.target.value});
    }

    render(){
        console.log(this.state.textVal);

        return (
            <input type="text" value={this.state.textVal} onChange={this.ValueChange} />
        )
    }
}

export default NumericField;