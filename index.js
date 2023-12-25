require('dotenv').config();
const express = require('express');

const cache = require('memory-cache');

const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const CHUCK_NORRIS_API = 'https://api.chucknorris.io/jokes';

// MIDDLEWARE TO ALLOW REQUEST TO ALL ROUTES
app.use(cors());

// MIDDLEWARE  TO ALLOW DATA CACHING
const cacheMiddleware = (req, res, next) => {
	const { page = 1, query = 'Dev' } = req.query;

	const cachedData = cache.get(query.toLowerCase());

	if (cachedData) {
		const joke = cachedData.result.slice(page - 1, +page)[0];
		if (joke) return res.json({ total: cachedData.total, result: joke });
	}

	next();
};

// GET CATEGORIES
app.get('/categories', async (_, res) => {
	try {
		const { data = [] } = await axios.get(`${CHUCK_NORRIS_API}/categories`);

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: 'Get categories went wrong!' });
	}
});

// GET JOKES RANDOMLY
app.get('/jokes/random', async (req, res) => {
	try {
		const { data = {} } = await axios.get(`${CHUCK_NORRIS_API}/random`);

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: 'Get random joke went wrong!' });
	}
});

// GET JOKES BY TEXT
app.get('/jokes/free_text', cacheMiddleware, async (req, res) => {
	try {
		const { page = 1, query = 'Dev' } = req.query;

		const { data = [] } = await axios.get(
			`${CHUCK_NORRIS_API}/search?query=${query}`
		);

		let joke;
		if (data.result) joke = data.result.slice(page - 1, page)[0];

		// Cache the response for future requests
		cache.put(query.toLowerCase(), data, 10 * 60 * 6000); // Cache for 60 minutes -- 1hr

		res.json({ total: data.total, result: joke });
	} catch (error) {
		res.status(500).json({
			error: 'Search by text went went wrong! Check your search value.',
		});
	}
});

// GET JOKES BY CATEGORY
app.get('/jokes/:category', async (req, res) => {
	try {
		const { category = '' } = req.params;

		const { data = {} } = await axios.get(
			`${CHUCK_NORRIS_API}/random?category=${category}`
		);

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: 'Get by category went wrong!' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
