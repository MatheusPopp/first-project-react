import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitForm from './componentes/SubmitForm';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import TratadorErros from './TratadorErros';


class FormLivro extends Component {

    constructor() {
        super();
        this.state = { titulo: '', preco: '', autor: '' }

        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutor = this.setAutor.bind(this);
    }

    setTitulo(evento) { this.setState({ titulo: evento.target.value }); }

    setPreco(evento) { this.setState({ preco: evento.target.value }); }

    setAutor(evento) { this.setState({ autor: evento.target.value }); }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autor }),
            beforeSend: function () {
                PubSub.publish("limpa-erros", {});
            },
            success: function (result) {
                //Dispara evento para atualização da grid
                PubSub.publish('updateGridLivro', result);
                this.setState({ titulo: '', preco: '', autor: '' });
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
                    <InputCustomizado id="nome" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" htmlFor="titulo" />
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preco" htmlFor="preco" />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autor} name="autorId" id="autorId" onChange={this.setAutor}>
                            <option value="">Selecione autor</option>
                            {
                                this.props.autores.map(autor => {
                                    return <option value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                    </div>
                    <SubmitForm buttonName="Gravar" />
                </form>
            </div>
        );

    }
}

class GridLivros extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.dataSource.map(x => {
                                return (
                                    <tr key={x.id}>
                                        <td>{x.titulo}</td>
                                        <td>{x.preco}</td>
                                        <td>{x.autor.nome}</td>
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

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = { dataSource: [], autores: [] };
    }

    componentDidMount() {

        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: function (result) {
                this.setState({ dataSource: result });
            }.bind(this) //bind o 'this' do react -> informa que o 'this' é do react e não do jquery
        });

        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (result) {
                this.setState({ autores: result });
            }.bind(this) //bind o 'this' do react -> informa que o 'this' é do react e não do jquery
        });



        //Listener para o event de atualização da grid
        PubSub.subscribe('updateGridLivro', function (topico, result) {
            this.setState({ dataSource: result })
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Livros</h1>
                </div>
                <div className="content">
                    <FormLivro autores={this.state.autores}></FormLivro>
                    <GridLivros dataSource={this.state.dataSource}></GridLivros>
                </div>
            </div>
        );
    }

}


