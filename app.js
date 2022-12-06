const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');

require('dotenv').config();

const app = express();

app.use(express.static(__dirname + "/src/static/"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.TENANT_URL
};

app.use(auth(config));

app.get("/", (req, res) => {
    // if (req.oidc.user != undefined) {
    //     console.log({
    //                     name: req.oidc.user.name,
    //                     email: req.oidc.user.email,
    //                     id: req.oidc.user.sub
    //                 });
    // } else {
    //     console.log("Nenhum usuário conectado.")
    // }
    res.sendFile(__dirname + "/src/pages/index.html")
});

app.get("/conectar", (req, res) => {
    res.sendFile(__dirname + '/src/pages/conectar.html')
    // res.oidc.login({ returnTo: '/cadastrar' })
});

app.post("/conectar", (req, res) => {
    fetch(process.env.TENANT_URL + '/oauth/token', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    grant_type: 'password',
                    username: req.body.email,
                    password: req.body.senha,
                    audience: 'https://github.com/luanhenzo/hard2explain',
                    scope: 'openid',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET
                  })})
                  .then((response) => {return response.json()})
                  .then((data) => {
                        console.log(data);
                        res.redirect("/");
                    });
});

app.get("/cadastrar", (req, res) => {
    res.sendFile(__dirname + "/src/pages/cadastrar.html");
});

app.post("/cadastrar", (req, res) => {  

    const requestData = {
        "client_id": process.env.CLIENT_ID,
        "email": req.body.email,
        "password": req.body.senha,
        "name": req.body.nome_completo,
        "connection": "Username-Password-Authentication",
        "user_metadata": {
            "cpf_Cnpj": req.body.cpf,
            "id_genero": req.body.genero,
            "dt_nascimento": req.body.dt_nascimento
        }
    }

    fetch(process.end.TENANT_URL + '/dbconnections/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            fetch(process.end.TENANT_URL + '/oauth/token', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    grant_type: 'password',
                    username: data.email,
                    password: req.body.senha,
                    audience: 'https://github.com/luanhenzo/hard2explain',
                    scope: 'read:sample',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET
                  })})
                  .then((response) => {return response.json()})
                  .then((data) => {
                        res.redirect("/");
                    });
        }).catch((err) => {
            console.error(err);
            res.redirect("/");
        });
});

app.get("/profile", (req, res) => {
    if (req.oidc.user != undefined) {
        console.log(req.oidc.user);
        res.send(`Welcome, ${req.oidc.user.email}!`)
    } else {
        res.redirect("/conectar");
        console.log("Nenhum usuário logado!");
    }
});

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
});     