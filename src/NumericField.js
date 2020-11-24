import React from 'react';

class NumericField extends React.Component {

    constructor(props) {
        super(props);

        this.ValueChange = this.ValueChange.bind(this);

        this.state = {
            textVal: props.startVal
        }
    }

    ValueChange(evt) {
        this.setState({ textVal: evt.target.value });

        if (isNaN(evt.target.value))
            return;

        this.props.callback(this.props.settingName, parseInt(evt.target.value));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.startVal !== this.props.startVal)
            this.setState({ textVal: this.props.startVal });
    }

    render() {
        let textbox;

        if (this.props.enabled)
            textbox = <input type="text" value={this.state.textVal} onChange={this.ValueChange}  />;
        else
            textbox = <input type="text" value={this.state.textVal} onChange={this.ValueChange} disabled/>;

        return (
            <div className="test">
                {textbox}
            </div>

        )
    }
}

export default NumericField;