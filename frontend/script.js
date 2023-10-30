document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const pokemonName = document.getElementById("pokemonName");
    const pokemonId = document.getElementById("pokemonId");
    const pokemonType = document.getElementById("pokemonType");
    const pokemonHeight = document.getElementById("pokemonHeight");
    const pokemonWeight = document.getElementById("pokemonWeight");
    const abilitiesList = document.getElementById("abilitiesList");
    const formsList = document.getElementById("formsList");
    const hpStat = document.getElementById("hpStat");
    const attackStat = document.getElementById("attackStat");
    const defenseStat = document.getElementById("defenseStat");
    const specialAttackStat = document.getElementById("specialAttackStat");
    const specialDefenseStat = document.getElementById("specialDefenseStat");
    const speedStat = document.getElementById("speedStat");
    const radarChartContainer = document.getElementById("radarChartContainer");

    searchButton.addEventListener("click", async () => {
        const searchTerm = searchInput.value.toLowerCase();
        const pokemonURL = `http://localhost:5001/api/pokemon/${searchTerm}`;

        try {
            const response = await fetch(pokemonURL);

            if (response.ok) {
                const data = await response.json();

                pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                pokemonId.textContent = `ID: ${data.id}`;

                const typesText = Array.isArray(data.types) ? data.types.join(", ").toUpperCase() : "Unknown Type";
                pokemonType.textContent = `Type: ${typesText}`;

                pokemonHeight.textContent = `Height: ${data.height}`;
                pokemonWeight.textContent = `Weight: ${data.weight}`;
                abilitiesList.textContent = `Abilities: ${data.abilities.join(", ").toUpperCase()}`;
                formsList.textContent = `Forms: ${data.forms.join(", ").toUpperCase()}`;

                const totalStats = data.baseStats.hp + data.baseStats.attack +
                    data.baseStats.defense + data.baseStats.specialAttack +
                    data.baseStats.specialDefense + data.baseStats.speed;

                const hpPercentage = (data.baseStats.hp / totalStats) * 100;
                const attackPercentage = (data.baseStats.attack / totalStats) * 100;
                const defensePercentage = (data.baseStats.defense / totalStats) * 100;
                const specialAttackPercentage = (data.baseStats.specialAttack / totalStats) * 100;
                const specialDefensePercentage = (data.baseStats.specialDefense / totalStats) * 100;
                const speedPercentage = (data.baseStats.speed / totalStats) * 100;

                hpStat.style.width = `${hpPercentage}%`;
                attackStat.style.width = `${attackPercentage}%`;
                defenseStat.style.width = `${defensePercentage}%`;
                specialAttackStat.style.width = `${specialAttackPercentage}%`;
                specialDefenseStat.style.width = `${specialDefensePercentage}%`;
                speedStat.style.width = `${speedPercentage}%`;

                radarChartContainer.innerHTML = "";
                if (data.radarChartImage) {
                    const radarChartImage = document.createElement("img");
                    radarChartImage.src = data.radarChartImage;
                    radarChartContainer.appendChild(radarChartImage);
                }
            } else {
                resetPokemonInfo();
                console.error(`Error fetching Pokemon data: ${response.status}`);

                if (response.status === 404 || response.status === 500) {
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                }
            }
        } catch (error) {
            resetPokemonInfo();
            console.error("Error fetching Pokemon data: ", error);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    });

    function resetPokemonInfo() {
        pokemonName.textContent = "Pokemon not found";
        pokemonId.textContent = "";
        pokemonType.textContent = "";
        pokemonHeight.textContent = "";
        pokemonWeight.textContent = "";
        abilitiesList.textContent = "";
        formsList.textContent = "";
        hpStat.style.width = "0%";
        attackStat.style.width = "0%";
        defenseStat.style.width = "0%";
        specialAttackStat.style.width = "0%";
        specialDefenseStat.style.width = "0%";
        speedStat.style.width = "0%";
        radarChartContainer.innerHTML = "";
    }
});
