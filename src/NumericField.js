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

    componentDidUpdate(prevProps,prevState){
        if (prevProps.startVal !== this.props.startVal)
            this.setState({textVal:this.props.startVal});
        
    }

    render(){
        return (
            <input type="text" value={this.state.textVal} onChange={this.ValueChange} />
        )
    }
}

export default NumericField;