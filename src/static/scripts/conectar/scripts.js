const encryptation = require('../utils/encryptation.js');
const hasura_config = require('../../api/hasura.config.json');

async function logar(email, passw) {
    const hashed_passw = encryptation.encrypt(passw);

    const headers = {
        "Content-Type": 'application/json',
        "x-hasura-admin-secret": hasura_config.production["x-hasura-admin-secret"],
    };

    const graphqlQuery = {   
        "query": 
            `query {
                usuarios (where: { email: { _eq: "${email}" },
                                    senha: { _eq: "${hashed_passw}"}}) {
                    id
                    email
                    senha
                }
            }`,
        };

    const options = {
        "method": 'POST',
        "credentials": 'include',
        "headers": headers,
        "body": JSON.stringify(graphqlQuery)
    }

    const response = await fetch(hasura_config.production.url, options);

    return response.json();
};

module.exports = {
    logar,
}