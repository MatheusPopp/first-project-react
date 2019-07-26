import PubSub from 'pubsub-js'

export default class TratadorErros {

    publicaErros(erros) {
       erros.errors.forEach(x => {
            console.log(x);
            PubSub.publish('erro-validacao', x);
       });
    }
}