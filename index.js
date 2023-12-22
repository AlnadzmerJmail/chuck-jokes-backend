require('dotenv').config();
const express = require('express');

const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const CHUCK_NORRIS_API = 'https://api.chucknorris.io/jokes';

console.log(process.env.PORT);

// MIDDLEWARE TO ALLOW REQUEST TO ALL ROUTES
app.use(cors());

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
		const { category = '' } = req.params;
		const { query = '' } = req.query;

		const { data = {} } = await axios.get(`${CHUCK_NORRIS_API}/random`);

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: 'Get random joke went wrong!' });
	}
});

// GET JOKES BY CATEGORY
app.get('/jokes/:category', async (req, res) => {
	try {
		const { category = '' } = req.params;
		const { query = '' } = req.query;

		const { data = {} } = await axios.get(
			`${CHUCK_NORRIS_API}/random?category=${category}`
		);

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: 'Get by category went wrong!' });
	}
});

// GET JOKES BY TEXT
app.get('/jokes/free_text/:queryString', async (req, res) => {
	try {
		const { queryString = '' } = req.params;

		const { data = [] } = await axios.get(
			`${CHUCK_NORRIS_API}/search?query=${queryString}`
		);

		res.json(data);
	} catch (error) {
		res.status(500).json({
			error: 'Search by text went went wrong! Check your search value.',
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
