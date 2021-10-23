const pokeImg = document.querySelector(".card-img-top");
const pokeName = document.querySelector(".card-title");
const pokeInfo = document.querySelectorAll(".list-group-item");
const [pokeType, firstAbility, secondAbility] = pokeInfo;

const renderInfo = function (data) {
  const [ability1, ability2] = data.abilities;
  const [type1, type2] = data.types;
  pokeName.innerHTML = data.name[0].toUpperCase() + data.name.slice(1);

  pokeImg.src = data.sprites.front_default;
  pokeType.textContent = `Type:${type1.type["name"]}${
    !type2 ? "" : "," + type2.type["name"]
  }`;

  firstAbility.innerHTML = `<strong>Ability 1:</strong>${ability1.ability["name"]}`;

  if (data.abilities.length > 1) {
    // pokeAbility2 = document.querySelectorAll(".list-group-item")[2];
    secondAbility.innerHTML = `<strong>Ability 2:</strong> ${ability2.ability["name"]}`;
  } else {
    secondAbility.textContent = " ";
  }
};

const searchPokemon = async function () {
  let pokemon = document.querySelector(".chosenPokemon").value.toLowerCase();
  console.log(pokemon);
  try {
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    let pokeInfo = await data.json();
    console.log(pokeInfo);
    renderInfo(pokeInfo);
  } catch (err) {
    console.error(err);
    document.querySelector(
      "h2"
    ).textContent = `Failed to find Pokemon:${pokemon}. Either system failed to look for data or ${pokemon} does not exist. Please try again.`;
  }
};

//////////////////////////////////////////////////////////

// pokeImg.src = data.sprites.front_default;
// pokeType.textContent = `Type:${type1.type["name"]}${
//   !type2 ? "" : "," + type2.type["name"]
// }`;
// firstAbility.textContent = `Ability 1: ${ability1.ability["name"]}`;

// if (data.abilities.length > 1) {
//   // pokeAbility2 = document.querySelectorAll(".list-group-item")[2];
//   secondAbility.textContent = `Ability 2: ${ability2.ability["name"]}`;
// } else {
//   secondAbility.textContent = " ";
// }
//   let html = `
//   <div class="container">
//   <div class="card" style="width: 18rem">
//     <img src="${
//       data.sprites.front_default
//     }" class="card-img-top" alt="Pokemon img" />
//     <div class="card-body">
//       <h5 class="card-title">${pokemonName}</h5>
//       <p class="card-text">Not sure what to place here. May delete.</p>
//     </div>
//     <ul class="list-group list-group-flush">
//       <li class="list-group-item"><strong>Type:</strong>${type1.type["name"]}${
//     !type2 ? "" : "," + type2.type["name"]
//   }}</li>
//       <li class="list-group-item"><strong>Ability 1:</strong>${
//         ability1.ability["name"]
//       } </li>
//       <li class="list-group-item"><strong>Ability 2:</strong>${
//         data.abilities.length > 1 ? ability2.ability["name"] : " "
//       }</li>
//     </ul>
//     <div class="card-body">
//       <input type="text" name="searchValue" class="chosenPokemon" />
//       <button type="submit" onclick="searchPokemon()">Search</button>
//     </div>
//   </div>
// </div>`;
//   document
//     .querySelector(".main-container")
//     .insertAdjacentHTML("beforeend", html);
