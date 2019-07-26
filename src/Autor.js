import React, { Component } from 'react'
import $ from 'jquery'
import InputCustomizado from './componentes/InputCustomizado'
import SubmitForm from './componentes/SubmitForm'

class FormAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' }
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    setNome(evento) { this.setState({ nome: evento.target.value }); }

    setEmail(evento) { this.setState({ email: evento.target.value }); }

    setSenha(evento) { this.setState({ senha: evento.target.value }); }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (result) {
                this.props.onSuccess(result);
            }.bind(this),
            error: function (result) {
                console.log("erro");
            }
        });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" htmlFor="nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" htmlFor="email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" htmlFor="senha" />
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
        this.onSuccess = this.onSuccess.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (result) {
                this.setState({ dataSource: result });
            }.bind(this) //bind o 'this' do react -> informa que o 'this' é do react e não do jquery
        });
    }

    onSuccess(dataSource) {
        this.setState({dataSource: dataSource})
    }

    render() {
        return (
            <div>
                <FormAutor onSuccess= {this.onSuccess}></FormAutor>
                <GridAutores dataSource = {this.state.dataSource}></GridAutores>
            </div>
        );
    }
}