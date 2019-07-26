import React, { Component } from 'react';
import './App.css';
import './css/pure-min.css'
import './css/side-menu.css'
import $ from 'jquery'
import InputCustomizado from './componentes/InputCustomizado'

class App extends Component {

  //Construtor da classe (componente)
  constructor() {
    //necessário chamar o construtor da classe pai para acessar o 'this'
    super();
    //estado do objeto -> state única varíavel que o react observa
    this.state = {
      dataSource: [],
      nome: '',
      email: '',
      senha: ''

    };

    //Associa o this da classe para o 'enviaForm' -> dentro do 'enviaForm' ele não reconhece o 'this' automaticamente, assim é necessário realizar o bind
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  setNome(evento) {
    evento.preventDefault();
    this.setState({ nome: evento.target.value });
  }

  setEmail(evento) {
    evento.preventDefault();
    this.setState({ email: evento.target.value });
  }

  setSenha(evento) {
    evento.preventDefault();
    this.setState({ senha: evento.target.value });
  }


  //Método descontinuado, utilizar componentDidMount para ações que produzem side-effects ou o construtor para casos que não produzem side-effects
  componentDidMount() {
    $.ajax({
      url: "http://localhost:8080/api/autores",
      dataType: 'json',
      success: function (result) {
        //Atualização do estado do componente -> quando utilizado o 'setState' o React renderiza o componente novamente
        this.setState({ dataSource: result });
      }.bind(this) //bind o 'this' do react -> informa que o 'this' é do react e não do jquery
    });
  }

  enviaForm(evento) {
    evento.preventDefault();
    $.ajax({
      url: "http://localhost:8080/api/autores",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
      success: function (result) {
        this.setState({ dataSource: result });
        console.log("enviado com sucesso");
      }.bind(this),
      error: function (restul) {
        console.log("erro");
      }
    });
  }

  //Método para renderizar o html (Componente)
  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>

        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="#">Company</a>

            <ul className="pure-menu-list">
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" htmlFor="nome"/>
                <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" htmlFor="email"/>
                <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" htmlFor="senha"/>
                <div className="pure-control-group">
                  <label></label>
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                </div>
              </form>

            </div>
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
                    this.state.dataSource.map(x => {
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
          </div>
        </div>
      </div>
    );
  }
}

export default App;
