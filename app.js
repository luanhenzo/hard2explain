const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const conectar = require("./src/static/scripts/conectar/scripts.js");

const app = express();

app.use(express.static(__dirname + "/src/static/"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log(req.cookies.CONNECTED_USER);
    res.sendFile(__dirname + "/src/pages/index.html")
});

app.get("/conectar", (req, res) => {
    res.sendFile(__dirname + "/src/pages/conectar.html")
});

app.post("/conectar", (req, res) => {
    conectar.logar(req.body.email, req.body.senha)
        .then((data) => {
            if (data.data.usuarios.length === 1) {
                res.cookie('CONNECTED_USER', data.data.usuarios[0].email);
                console.log("Conectado com sucesso!");
            } else if (data.data.usuarios.length > 1) {
                console.log("Temos um problemão.");
            } else {
                console.log("Não foi possível se conectar!");
            }
            res.sendFile(__dirname + "/src/pages/conectar.html")
        });
});

app.get("/cadastrar", (req, res) => {
  res.sendFile(__dirname + "/src/pages/cadastrar.html")
});

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
  });