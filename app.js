const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const conectar = require("./src/static/scripts/conectar/scripts.js");

const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname + "/src/static/"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/pages/index.html")
  console.log(req.cookies.CONNECTED_USER);
});

app.get("/conectar", (req, res) => {
    res.sendFile(__dirname + "/src/pages/conectar.html")
});
  
app.post("/conectar", (req, res) => {
    res.sendFile(__dirname + "/src/pages/conectar.html")
    console.log(conectar.logar(req.body.email, req.body.senha));
});

app.get("/cadastrar", (req, res) => {
  res.sendFile(__dirname + "/src/pages/cadastrar.html")
});