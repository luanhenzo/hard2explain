const encryptation = require('../utils/encryptation.js')
const hasura_config = require('../../api/hasura.config.json');

async function cadastrarUsuarios(nome_completo, email, cpf, dt_nascimento, genero, senha) {
    const senhaCiphered = encryptation.encrypt(senha);

    const headers = {
        "Content-Type": 'application/json',
        "x-hasura-admin-secret": hasura_config.production["x-hasura-admin-secret"],
    };

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

    const options = {
        "method": 'POST',
        "headers": headers,
        "body": JSON.stringify(graphqlQuery)
    }

    const response = await fetch(hasura_config.production.url, options);
    
    return response.json();
}

module.exports = {
    cadastrarUsuarios,
}