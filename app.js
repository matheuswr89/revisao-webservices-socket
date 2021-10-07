var http = require("http"),
  fs = require("fs"),
  index = fs.readFileSync(__dirname + "/index.html");

// Send index.html to all requests
var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

// Socket.io server listens to our app
var io = require("socket.io").listen(app);

let phraseResponse = "";
io.on("connection", function (socket) {
  socket.on("send", (response) => {
    const pattern = /\d/;
    let phrase = String(response.input);
    if (phrase !== undefined) {
      let length = phrase.length;
      let split = phrase.split(" ");
      let lengthWords = split.length;
      let sum = 0;
      for (let i = 0; i < lengthWords; i++) {
        sum += split[i].length;
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
  socket.emit("receive", { message: phraseResponse, id: socket.id });
});

app.listen(3000);
