const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const typeSearchButton = document.getElementById("typeSearchButton");
const typeSearchInput = document.getElementById("typeSearchInput");
const clearSearchButton = document.getElementById("clearSearchButton");
const errorBox = document.getElementById("errorBox");

const maxRecords = 151;
const limit = 10;
let offset = 0;

let listedPokemons = [];
let filteredPokemons = [];

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${formatNumber(pokemon.number)}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function formatNumber(number) {
  return String(number).padStart(4, "0");
}

function loadPokemonItens(offset, limit) {
  typeSearchInput.focus();
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    listedPokemons.push(...pokemons);
    pokemonList.innerHTML += !typeSearchInput.value ? newHtml : "";
    filterPokemons();
    window.scrollTo(0, 10000);
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", loadMorePokemons);

typeSearchButton.addEventListener("click", filterPokemons);

clearSearchButton.addEventListener("click", resetState);

typeSearchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter")
    if (typeSearchInput.value) filterPokemons();
    else resetState();
  if (event.key === "Escape") typeSearchInput.value = "";
  typeSearchButton.disabled = !Boolean(typeSearchInput.value.trim());
});

function loadMorePokemons() {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.style.display = "none";
  } else {
    loadPokemonItens(offset, limit);
  }
}

function filterPokemons() {
  if (typeSearchInput.value) {
    if (listedPokemons.length === maxRecords && !filteredPokemons.length) {
      pokemonList.style.display = "none";
      errorBox.hidden = false;
      return;
    }

    const qtdPokemons = filteredPokemons.length;
    filteredPokemons = listedPokemons.filter((p) =>
      p.types.some((t) => t.includes(typeSearchInput.value))
    );
    if (qtdPokemons !== filteredPokemons.length)
      pokemonList.innerHTML = filteredPokemons.map(convertPokemonToLi).join("");
    if (qtdPokemons < 10 && offset < maxRecords) loadMoreButton.click();
  }
}

function resetState() {
  errorBox.hidden = true;
  typeSearchInput.focus();
  typeSearchInput.value = "";
  loadMoreButton.style.display = "";
  if (filteredPokemons.length || listedPokemons.length > 10) {
    pokemonList.innerHTML = "";
    pokemonList.style.display = "";
    listedPokemons = [];
    filteredPokemons = [];
    offset = 0;
    loadPokemonItens(offset, limit);
  }
}
