const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());

// Route to fetch restaurant data
app.get('/api/restaurants', async (req, res) => {
  const url = `${process.env.SWIGGY_RESTAURANTS_PATH}`;
  
  try {
    const response = await axios.get(url);
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
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching menu for restaurant:`, error.message);
    res.status(500).json({
      error: 'Error fetching menu from the server',
      details: error.message
    });
  }
});

app.get('/api/restaurant-images/:imageId', (req, res) => {
  const { imageId } = req.params;
  const imageUrl = `${process.env.SWIGGY_IMAGE_BASE_URL}${imageId}`;
  
  console.log(`Serving image from: ${imageUrl}`);
  res.redirect(imageUrl);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
