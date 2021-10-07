var http = require("http"),
  fs = require("fs"),
  index = fs.readFileSync(__dirname + "/index.html");

// Envia index.html para as requisições
var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

// Socket.io server ouve o app
var io = require("socket.io").listen(app);

let phraseResponse = "";
//cria a conexão
io.on("connection", function (socket) {
  //recebe o input do usuário
  socket.on("send", (response) => {
    const pattern = /\d/,
      pattern2 = /\s/;
    let phrase = String(response.input);
    if (phrase !== undefined) {
      let length = phrase.length;
      let split = phrase.split(pattern2);
      let lengthWords = split.length;
      let sum = 0;
      for (let i = 0; i < lengthWords; i++) {
        if (split[i] != "") sum += split[i].length;
      }
      let average = sum / lengthWords;
      phraseResponse = `
      <p>Quantidade de caracteres: ${length}</p>
      <p>Há números na mensagem: ${pattern.test(phrase) ? "sim" : "não"}</p>
      <p>Quantidade de palavras: ${lengthWords}</p>
      <p>Tamanho médio de caracteres das palavras: ${average}</p>
    `;
    }
  });
  //envia o resultado
  socket.emit("result", { message: phraseResponse, id: socket.id });
});

app.listen(3000);
