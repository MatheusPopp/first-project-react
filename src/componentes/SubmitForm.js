import React, { Component } from 'react'


class SubmitForm extends Component {

    render() {
        return (
            <div className="pure-control-group">
                <label></label>
                <button type="submit" className="pure-button pure-button-primary">{this.props.buttonName}</button>
            </div>
        );
    }
}

export default SubmitForm;