import React, { Component } from 'react';

class InputCustomizado extends Component {


    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.htmlFor}>{this.props.label}</label>
                <input required id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />
            </div>
        );
    }
}

export default InputCustomizado;