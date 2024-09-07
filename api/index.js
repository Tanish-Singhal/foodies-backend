const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: 'http://localhost:4173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const userAgentHeader = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  }
};

app.get('/api/restaurants', async (req, res) => {
  const url = `${process.env.SWIGGY_RESTAURANTS_PATH}`;
  
  try {
    const response = await axios.get(url, userAgentHeader);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching restaurant data:', error.message);
    res.status(500).json({ 
      error: 'Error fetching data from the server',
      details: error.message
    });
  }
});

app.get('/api/restaurant-menu/:id', async (req, res) => {
  const { id } = req.params;
  const url = `${process.env.SWIGGY_MENU_PATH}${id}`;
  
  try {
    const response = await axios.get(url, userAgentHeader);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching menu for restaurant:`, error.message);
    res.status(500).json({
      error: 'Error fetching menu from the server',
      details: error.message
    });
  }
});

app.get('/api/restaurant-images/*', async (req, res) => {
  const imageId = req.params[0];
  const imageUrl = `${process.env.SWIGGY_IMAGE_BASE_URL}${imageId}`;
  
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    res.set('Access-Control-Allow-Origin', '*');
    
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).send('Error fetching image');
  }
});

app.listen(PORT);