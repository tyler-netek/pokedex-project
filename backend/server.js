const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());

app.get('/api/pokemon/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const pokemonData = response.data;

        const abilities = pokemonData.abilities.map(ability => ability.ability.name);
        const forms = pokemonData.forms.map(form => form.name);

        const responseData = {
            name: pokemonData.name,
            id: pokemonData.id,
            height: pokemonData.height,
            weight: pokemonData.weight,
            abilities: abilities,
            forms: forms,
            sprite: pokemonData.sprites.other['official-artwork'].front_default
        };

        res.json(responseData);
    } catch (error) {
        console.error(`Error fetching Pokemon data from PokeAPI: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});