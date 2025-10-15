/**
 * Midterm API Project - COMP229
 *
 * Challenge: Implement the API logic for managing a collection of video games!
 *
 * Here's the setup:
 * A server is already running on port 3000 with an array of game objects.
 * Your mission is to implement the missing logic for each of the endpoints below.
 *
 * Endpoints:
 * 1. GET /api/games       - Retrieve the full list of games.
 * 2. GET /api/games/filter?genre=[genre name] - Retrieve games by genre match.
 * 3. GET /api/games/:id   - Retrieve a game by its index.
 * 4. POST /api/games      - Add a new game to the library.
 * 5. PUT /api/games/:id   - Update a game by its index.
 * 6. DELETE /api/games/:id - Remove a game from the library by its index.
 *
 * The array of games is already defined for you, but you need to bring the logic
 * to life. Test your work using tools like Postman, Thunder Client, or Insomnia.
 *
 * Submission Requirements:
 * 1. Screenshots: Provide one per endpoint, showing the request details and a
 *    successful response with the correct status code.
 * 2. Code Submission: Zip your project, share the repo link, and ensure your
 *    personalized games are present.
 *
 * Good luck, and may your code be bug-free!
 */

const express = require('express');
const { platform } = require('os');
const path = require('path');
const { title } = require('process');
const app = express();
app.use(express.json());

// Serve static files (e.g., images, CSS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.param('id', (req, res, next, id) => {
  const num = Number(req.params.id);
  if (!Number.isInteger(num)) {
    return res.status(400).json({ error: 'id must be an integer' });
  }

  if (id < 0) {
    return res
      .status(400)
      .json({ error: 'id must be greater than or equal to zero' });
  }

  next();
});

// Array of game objects
let games = [
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    genre: 'Adventure',
    platform: 'Nintendo Switch',
    year: 2017,
    developer: 'Nintendo',
  },
  {
    title: 'God of War',
    genre: 'Action',
    platform: 'PlayStation 4',
    year: 2018,
    developer: 'Santa Monica Studio',
  },
  {
    title: 'Hollow Knight',
    genre: 'Metroidvania',
    platform: 'PC',
    year: 2017,
    developer: 'Team Cherry',
  },
  {
    title: 'Forza Horizon 5',
    genre: 'Racing',
    platform: 'Xbox Series X|S',
    year: 2021,
    developer: 'Playground Games',
  },
  {
    title: 'Stardew Valley',
    genre: 'Simulation',
    platform: 'Nintendo Switch',
    year: 2016,
    developer: 'ConcernedApe',
  },
  {
    title: 'The Legend of Zelda: Ocarina of Time',
    genre: 'Adventure',
    platform: 'Nintendo 64',
    year: 1998,
    developer: 'Nintendo',
  },
  {
    title: 'Pokemon Red Version',
    genre: 'Role-playing Game (RPG)',
    platform: 'Game Boy',
    year: 1996,
    developer: 'Game Freak',
  },
];

// Set the port for the server
const PORT = 3000;

// Serve the instructions HTML file (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// API Endpoints

// GET /api/games
// Description: Get all games
// Task: Implement logic to return the full list of games
app.get('/api/games', (req, res) => {
  res.status(200).json({
    games: games,
  });
});

// GET /api/games/filter?genre=[genre name]
// Description: Filter games by genre
// Task: Implement logic to return games matching the specified genre
app.get('/api/games/filter', (req, res) => {
  const gameGenre = req.query.genre;

  if (!gameGenre || gameGenre === '') {
    res.status(400).json({
      error: 'query string empty or missing',
    });
    return;
  }

  const gamesByGenre = games.filter(({ genre }) => genre === gameGenre);
  if (gamesByGenre.length === 0) {
    res.status(404).json({
      error: `no games exist for the genre: ${gameGenre}`,
    });
    return;
  }

  res.status(200).send({
    games: games.filter(({ genre }) => genre === gameGenre),
  });
});

// GET /api/games/:id
// Description: Get a specific game by ID
// Task: Implement logic to return a game by its index (ID)
app.get('/api/games/:id', (req, res) => {
  if (req.params.id > games.length - 1) {
    res.status(404).json({
      error: `game object does not exist for the id: ${req.params.id}`,
    });
    return;
  }

  const gameObject = games[req.params.id];

  res.status(200).json({
    game: gameObject,
  });
});

// POST /api/games
// Description: Add a new game
// Task: Implement logic to add a new game to the array
app.post('/api/games', (req, res) => {
  games = [...games, req.body];
  res.status(201).json({
    games: games,
  });
});

// PUT /api/games/:id
// Description: Update a game by ID
// Task: Implement logic to update a game by its index (ID)
app.put('/api/games/:id', (req, res) => {
  if (req.params.id > games.length - 1) {
    res.status(404).json({
      error: `game object does not exist for the id: ${req.params.id}`,
    });
    return;
  }

  // console.log(req.params.id);
  // const gameObject = games[req.params.id];

  games = [
    ...games.map((game, i) => (i == req.params.id ? { ...req.body } : game)),
  ];
  res.status(200).json({
    games: games,
  });
});

// DELETE /api/games/:id
// Description: Remove a game by ID
// Task: Implement logic to remove a game by its index (ID)
app.delete('/api/games/:id', (req, res) => {
  if (req.params.id > games.length - 1) {
    res.status(404).json({
      error: `game object does not exist for the id: ${req.params.id}`,
    });
    return;
  }

  games = games.filter((_, i) => req.params.id != i);

  res.status(200).json({
    games: games,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
