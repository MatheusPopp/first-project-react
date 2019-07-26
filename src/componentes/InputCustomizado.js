import React, { Component } from 'react';
import PubSub from 'pubsub-js'

class InputCustomizado extends Component {

    constructor(){
        super();
        this.state = {msgErro: ''}
    }

    componentDidMount() {
        PubSub.subscribe('erro-validacao', function(topico, erro){
            if(erro.field === this.props.name) {
                this.setState({msgErro: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe('limpa-erros', function(topico, result){
            this.setState({msgErro: ''});     
        }.bind(this));
    }
    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.htmlFor}>{this.props.label}</label>
                <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />
                <span className="erro">{this.state.msgErro}</span>
            </div>
        );
    }
}

export default InputCustomizado;