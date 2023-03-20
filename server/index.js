const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/public')));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/repos/:language', async (req, res) => {
  const { language } = req.params;
  try {
    const encodedLanguage = encodeURIComponent(language);
    const response = await axios.get(`https://api.github.com/search/repositories?q=language:${encodedLanguage}+stars:%3E=1600&sort=stars&order=desc&per_page=5&page=1`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    res.json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});