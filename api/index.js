const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());

// Route to fetch restaurant data
app.get('/api/restaurants', async (req, res) => {
  const url = 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING';
  
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
  
  const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;
  
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
  const url = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/";
  const { imageId } = req.params;

  const imageUrl = `${url}${imageId}`;
  console.log(`Serving image from: ${imageUrl}`);

  res.redirect(imageUrl);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
