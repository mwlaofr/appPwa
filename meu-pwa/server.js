const express = require('express');
const path = require('path');
const app = express();

// Porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;

// Servir os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});

