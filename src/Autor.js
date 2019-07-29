import React, { Component } from 'react'
import $ from 'jquery'
import InputCustomizado from './componentes/InputCustomizado'
import SubmitForm from './componentes/SubmitForm'
import PubSub from 'pubsub-js'
import TratadorErros from './TratadorErros';
import { Link } from 'react-router-dom'

class FormAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' }
        this.enviaForm = this.enviaForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    }


    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            beforeSend: function() {
                PubSub.publish("limpa-erros",{});
            },   
            success: function (result) {
                //Dispara evento para atualização da grid
                PubSub.publish('updateGridAutor', result);
                this.setState({nome:'',email:'',senha:''});
            }.bind(this),
            error: function (result) {
                if (result.status == 400) {
                    new TratadorErros().publicaErros(result.responseJSON);
                }
            }
        });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.handleChange} label="Nome" htmlFor="nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.handleChange} label="Email" htmlFor="email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.handleChange} label="Senha" htmlFor="senha" />
                    <SubmitForm buttonName="Gravar" />
                </form>
            </div>
        );
    }
}

class GridAutores extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.dataSource.map(x => {
                                return (
                                    <tr key={x.id}>
                                        <td>{x.nome}</td>
                                        <td>{x.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

//High-order Component -> componente responsável por encapsular um estado que será utilizado por outros componentes -> Sempre nomear com sufixo Box (Padrão)
export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { dataSource: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (result) {
                this.setState({ dataSource: result });
            }.bind(this) //bind o 'this' do react -> informa que o 'this' é do react e não do jquery
        });

        //Listener para o event de atualização da grid
        PubSub.subscribe('updateGridAutor', function (topico, result) {
            this.setState({ dataSource: result })
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <div className="content" id="content">
                        <FormAutor></FormAutor>
                        <GridAutores dataSource={this.state.dataSource}></GridAutores>
                </div>   
            </div>    
        );
    }
}