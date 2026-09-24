const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("client"));

const porta = 3000;

function pegarDados() {
    const dados = fs.readFileSync("dados.json", "utf8");
    return JSON.parse(dados);
}

function salvarDados(dados) {
    fs.writeFileSync("dados.json", JSON.stringify(dados, null, 4));
}

app.get("/usos", (req, res) => {

    let dados = pegarDados();

    if (req.query.tipo) {
        dados = dados.filter(item =>
            item.tipo.toLowerCase() == req.query.tipo.toLowerCase()
        );
    }

    if (req.query.nivel_risco) {
        dados = dados.filter(item =>
            item.nivel_risco.toLowerCase() == req.query.nivel_risco.toLowerCase()
        );
    }

    res.json(dados);
});

app.get("/usos/:id", (req, res) => {

    const dados = pegarDados();

    const id = Number(req.params.id);

    const uso = dados.find(item => item.id == id);

    if (!uso) {
        return res.status(404).json({
            mensagem: "Uso não encontrado"
        });
    }

    res.json(uso);
});

app.post("/usos", (req, res) => {

    const dados = pegarDados();

    let novoId = 1;

    if (dados.length > 0) {
        novoId = dados[dados.length - 1].id + 1;
    }

    const novoUso = {
        id: novoId,
        sistema: req.body.sistema,
        tipo: req.body.tipo,
        finalidade: req.body.finalidade,
        tecnologia: req.body.tecnologia,
        nivel_risco: req.body.nivel_risco,
        possui_revisao_humana: req.body.possui_revisao_humana
    };

    dados.push(novoUso);

    salvarDados(dados);

    res.status(201).json(novoUso);
});

app.put("/usos/:id", (req, res) => {

    const dados = pegarDados();

    const id = Number(req.params.id);

    const indice = dados.findIndex(item => item.id == id);

    if (indice == -1) {
        return res.status(404).json({
            mensagem: "Uso não encontrado"
        });
    }

    dados[indice] = {
        id: id,
        sistema: req.body.sistema,
        tipo: req.body.tipo,
        finalidade: req.body.finalidade,
        tecnologia: req.body.tecnologia,
        nivel_risco: req.body.nivel_risco,
        possui_revisao_humana: req.body.possui_revisao_humana
    };

    salvarDados(dados);

    res.json(dados[indice]);
});

app.delete("/usos/:id", (req, res) => {

    const dados = pegarDados();

    const id = Number(req.params.id);

    const indice = dados.findIndex(item => item.id == id);

    if (indice == -1) {
        return res.status(404).json({
            mensagem: "Uso não encontrado"
        });
    }

    dados.splice(indice, 1);

    salvarDados(dados);

    res.json({
        mensagem: "Uso excluído com sucesso"
    });
});

app.listen(porta, () => {
    console.log("Servidor funcionando em http://localhost:3000");
});