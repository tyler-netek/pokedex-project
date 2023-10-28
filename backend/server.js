const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'path/to/radar_chart_images_directory')));

app.get('/api/pokemon/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const pokemonData = response.data;

        const abilities = pokemonData.abilities.map(ability => ability.ability.name);
        const forms = pokemonData.forms.map(form => form.name);

        const baseStats = {
            hp: Math.floor((pokemonData.stats[0].base_stat / 255) * 100),
            attack: Math.floor((pokemonData.stats[1].base_stat / 255) * 100),
            defense: Math.floor((pokemonData.stats[2].base_stat / 255) * 100),
            specialAttack: Math.floor((pokemonData.stats[3].base_stat / 255) * 100),
            specialDefense: Math.floor((pokemonData.stats[4].base_stat / 255) * 100),
            speed: Math.floor((pokemonData.stats[5].base_stat / 255) * 100)
        };

        const responseData = {
            name: pokemonData.name,
            id: pokemonData.id,
            height: pokemonData.height,
            weight: pokemonData.weight,
            abilities: abilities,
            forms: forms,
            baseStats: baseStats,
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
