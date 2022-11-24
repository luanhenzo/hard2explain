const encryptation = require('../utils/encryptation.js')
const hasura_config = require('../../api/hasura.config.json');

function cadastrarUsuarios(nome_completo, email, cpf, dt_nascimento, genero, senha) {
    const senhaCiphered = encryptation.encrypt(senha);

    const usuario = 
        { query: `mutation {
            insert_usuarios_one (object: { email: "${email}", 
                                           senha: "${senhaCiphered}",
                                           status: "true",
                                           cpf_cnpj: "${cpf}",
                                           nome_razao_social: "${nome_completo}",
                                           dt_nascimento: "${dt_nascimento}",
                                           id_sexo: "${genero}" }
            ) {
                id
                nome_razao_social
                cpf_cnpj
                email
                senha
                }
            }`
        };

    fetch(hasura_config.production['url'],
        { method: 'POST',
            headers: {'x-hasura-admin-secret': hasura_config.production['x-hasura-admin-secret'],},
            body: JSON.stringify(usuario) })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

module.exports = {
    cadastrarUsuarios,
}