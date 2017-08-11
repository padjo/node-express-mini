const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

// TODO: your code to handle requests
const words = readWords();
const index = Math.floor(Math.random() * words.length);
const word = words[index];
console.log(word);

const guesses = {};

//ToDo your code to handle posts
server.post('/guess', (req, res) => {
  const letter = req.body.letter;
  if(!letter){
     res.status(STATUS_USER_ERROR);
     res.json({err: 'Must provide a letter'});
     return;
  }
  if(letter.length !== 1){
     res.status(STATUS_USER_ERROR);
     res.json({err: 'Must provide a single letter'});
     return;
  }
  if(guesses[letter]){
     res.status(STATUS_USER_ERROR);
     res.json(`err: You already guessed ${letter}`);
     return;
  }
  console.log(letter);
  guesses[letter] = true;  // adding letter prop to the guesses obj
  res.send({ guesses });
});

server.get('/', (req,res)=> {
  const wordSoFarArray = Array.from(word).map((letter) => {
  if (guesses[letter]){
     return letter;
  }
  return '-';
  });
  const wordSoFar = wordSoFarArray.join('');
  res.send({ wordSoFar, guesses }); 
});

server.listen(3000);
