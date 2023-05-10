const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

class User {
  constructor(username) {
    this.username = username;
  }
};

const GameCategory = {
  ACAO: "Ação",
  AVENTURA: "Aventura",
  CORRIDA: "Corrida",
  LUTA: "Luta",
  PLATAFORMA: "Plataforma",
  PUZZLE: "Puzzle",
  TIRO: "Tiro",
};

class Game {
  constructor(name, description, category) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.category = category;
  }
};

class HighScore {
  constructor (username, gameId, score) {
    this.id = uuidv4();
    this.date = new Date().getTime();
    this.username = username;
    this.gameId = gameId;
    this.score = score;
  }
}

const users = [
  new User('emerson')
];

let marioWorld = new Game('Super Mario World', 'Jogo classico do encanador', GameCategory.PLATAFORMA);

const games = [
  marioWorld
];

const highScores = [
  new HighScore('emerson', marioWorld.id, '874551093')
];

let loggedUser = null;

app.get('/', (req, res) => {
  res.send('Javascript + React no Curso de Outono URI-Erechim!');
});

app.listen(3008, () => {
  console.log('Servidor rodando na porta 3008');
});

class HighScoreUtils {
  static sortByScoreAndDate(highScores) {
    return highScores.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
  }

  static getTopScores(gameId, numScores = 10) {
    const gameScores = highScores.filter(highScore => highScore.gameId === gameId);
    return HighScoreUtils.sortByScoreAndDate(gameScores).slice(0, numScores);
  }

  static buildErrorResponse = (code, msg) => {
    return { success: false, errorCode: code, errorMessage: msg };
  }
};

app.get('/user', (req, res) => {
    res.send({ users });
});

app.get('/user/:id', (req, res) => {
    let user = users.find( user => user.username === req.params.id );
    if (typeof user != undefined) {
      res.send({user});
    } else {
      res.status(400).json(HighScoreUtils.buildErrorResponse('USERNAME_NOT_FOUND','Jogador não encontrado'));
    }
});
  
app.post('/user', (req, res) => {
  const { username } = req.body;
  let user = users.find( user => user.username === id );
  if (typeof user != undefined) {
    res.status(400).json(
      HighScoreUtils.buildErrorResponse('USERNAME_ALREADY_EXIST','O nome de jogador já está em uso')
    );
  } else {
    user = new User(username);
    res.json({success: true, user: user});
  }
});

app.put('/user/:id', (req, res) => {
  let user = users.find( user => user.username === req.params.id );
  if (typeof user != undefined) {
    res.json({success: true, user: user});
  } else {
    res.status(400).json(HighScoreUtils.buildErrorResponse('INVALID_USERNAME','Jogador não encontrado'));
  }
});

app.delete('/user', (req, res) => {
  res.status(405).setHeader('Allow', 'GET, POST, PUT').json(
    HighScoreUtils.buildErrorResponse('INVALID_OPERATION','Não é possível excluir jogadores')
  );
});

app.get('/user/login', (req, res) => {
  const { username } = req.body;
  let user = users.find( user => user.username === username );
  if (typeof user != undefined) {
    res.send({success: true, user: user});
  } else {
    res.status(400).json(HighScoreUtils.buildErrorResponse('USERNAME_NOT_FOUND','Jogador não encontrado'));
  }
});

app.post('/user/logout', (req, res) => {
  res.json({success: true});
});

// Endpoints para games
app.get('/games', (req, res) => {
  res.json(games);
});

app.get('/games/:id', (req, res) => {
  const { id } = req.params;
  const game = games.find(game => game.id === id);
  if (!game) {
    res.status(404).json(HighScoreUtils.buildErrorResponse('GAME_NOT_FOUND', 'Jogo não encontrado'));
  } else {
    res.json(game);
  }
});

app.post('/games', (req, res) => {
  const { name, description, category } = req.body;
  const game = new Game (name, description, category);
  games.push(game);
  res.json({success: true, game: game});
});

app.put('/games/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category } = req.body;
  const game = games.find(game => game.id === id);
  if (!game) {
    res.status(404).json(HighScoreUtils.buildErrorResponse('INVALID_GAME', 'Jogo não encontrado'));
  } else {
    game.nome = nome || game.nome;
    game.descricao = descricao || game.descricao;
    game.categoria = categoria || game.categoria;
    res.json({success: true, game: game});
  }
});

app.delete('/games/:id', (req, res) => {
  res.status(405).setHeader('Allow', 'GET, POST, PUT').json(
    HighScoreUtils.buildErrorResponse('INVALID_OPERATION','Não é possível excluir jogos')
  );
});

// Endpoints para scores
app.get('/scores', (req, res) => {
  const { gameId } = req.body;
  if (!gameId) {
    res.json(scores);
  } else {
    res.json(HighScoreUtils.getTopScores(gameId, 5));
  }
});

app.get('/scores/:id', (req, res) => {
  const { id } = req.params;
  const hs = highScores.find(hs => hs.id === id);
  if (!hs) {
    res.status(404).json(HighScoreUtils.buildErrorResponse('GAME_NOT_FOUND', 'Pontuação não encontrado'));
  } else {
    res.json(hs);
  }
});

app.post('/scores', (req, res) => {
  const { username, gameId, score } = req.body;
  const highScore = new HighScore ();
  highScores.push(highScore);
  res.json(highScore);
});

app.put('/scores/:id', (req, res) => {
  res.status(405).setHeader('Allow', 'GET, POST').json(
    HighScoreUtils.buildErrorResponse('INVALID_OPERATION','Não é possível alterar pontuações')
  );
});

app.delete('/scores/:id', (req, res) => {
  res.status(405).setHeader('Allow', 'GET, POST').json(
    HighScoreUtils.buildErrorResponse('INVALID_OPERATION','Não é possível excluir pontuações')
  );
});
