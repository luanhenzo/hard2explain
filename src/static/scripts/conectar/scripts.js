const encryptation = require('../utils/encryptation.js');
const hasura_config = require('../../api/hasura.config.json');

function logar(email, passw) {
    const hashed_passw = encryptation.encrypt(passw);

    const usuario = 
        { query: `
            query {
                usuarios (where: { email: { _eq: "${email}" },
                                   senha: { _eq: "${hashed_passw}"}}) {
                        id
                        email
                        senha
                }
            }`
        };

    fetch(hasura_config.production['url'],
        {
            method: 'POST',
            headers: { 'x-hasura-admin-secret': hasura_config.production['x-hasura-admin-secret'], },
            body: JSON.stringify(usuario)
        })
        .then((response) => response.json())
        .then((dados) => { console.log(dados.data.usuarios)});

};

module.exports = {
    logar,
}