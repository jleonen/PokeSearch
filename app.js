//Goal: Make an app where you can search for a specific pokemon and will render
//results on page

//Step 1 (COMPLETE): Find a template/make a template that will hold data together.
//Should look like a card like in bootstrap. Use bootstrap card

//Note: Data we are using is pokemon name, pokemon img/sprite, type and abilities
//The order from top to bottom is this: Pokemon img in the top, under img in middle,type, and abilities

//Step 2(COMPLETE): Place an input bar and a search button that will submit user's choice.
// const checkPokemon = function () {
//   const pokemon = document.querySelector(".chosenPokemon").value;
//   console.log(pokemon);
// };
//Step 3: Make a function that will look up pokemon from API and render it onto html.

//change img src
// pokeImg.src = "test.jpg";
//////////////////////////////////////////////////////////////////////////////////////
//EVENT LISTENER FOR RENDER INFO FUNCTION
const pokeImg = document.querySelector(".card-img-top");
const pokeName = document.querySelector(".card-title");
const pokeInfo = document.querySelectorAll(".list-group-item");
const [pokeType, firstAbility, secondAbility] = pokeInfo;

//EVENT LISTENER FOR SEARCH POKEMON FUNCTION
const locationsData = document.querySelector(".location-description");
const pokeEvolution = document.querySelector(".card-text");

//EVENT LISTENER FOR HIDDEN ABILITY INFO
const abilityInfo = document.querySelector(".ability-info");
const abilityName = document.querySelector(".ability-name");
const abilityDescription = document.querySelector(".ability-description");
const closeAbility = document.querySelector(".close-ability");

//EVENT LISTENER FOR HIDDEN LOCAITON INFO
const locationPrompt = document.querySelector(".location-info");
const closeLocation = document.querySelector(".close-location");

//EVENT LISTENERS FOR BOTH ABILITY AND LOCATION INFO
const abilitySelector = document.querySelectorAll(".fa-angle-double-right");
const [findAbility1, findAbility2, locations] = abilitySelector;
//////////////////////////////////////////////////////////////////////////////////////

/////////////////////////ABILITY SEARCH////////////////////////////////////

//RENDERING ABILITY INFO ON ABILITY CONTAINER
const renderAbility = function (ability) {
  abilityName.innerHTML = ability.name;
  abilityDescription.innerHTML = ability.effect_entries[1]["effect"];
};

//OPEN ABILITY WINDOW
const showAbility = async function () {
  try {
    abilityInfo.classList.remove("hidden");
    let abilityName;
    if (this.classList.contains("ability1")) {
      abilityName = pokeInfo[1].textContent.split(":");
    } else {
      abilityName = pokeInfo[2].textContent.split(":");
    }

    const data = await fetch(
      `https://pokeapi.co/api/v2/ability/${abilityName[1].trim()}/` //trim used to eliminate empty space and avoid error
    );
    const ability = await data.json();
    renderAbility(ability);
  } catch (err) {
    console.error(err);
    document.querySelector(
      "h2"
    ).textContent = `There was an error trying to fetch ability data. Please refresh the page and try again.`;
  }
};

//EVENT LISTENERS FOR ABILITIES
findAbility1.addEventListener("click", showAbility);
findAbility2.addEventListener("click", showAbility);

//CLOSE WINDOW
const closeAbilityInfo = function () {
  abilityInfo.classList.add("hidden");
};

closeAbility.addEventListener("click", closeAbilityInfo);

////////////////////////////////////FIND LOCATIONS//////////////////////////////////////
//OPEN LOCATION WINDOW
const showLocation = function () {
  locationPrompt.classList.remove("hidden");
};

locations.addEventListener("click", showLocation);

//CLOSE LOCATION WINDOW
const closeLocationInfo = function () {
  locationPrompt.classList.add("hidden");
};

closeLocation.addEventListener("click", closeLocationInfo);

/////////////////////////////////POKEMON SEARCH/////////////////////////////////

//SEARCH FOR PREVIOUS EVOLUTION
const showEvo = async function (data) {
  const evolution = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${data.name}`
  );
  const evolutionData = await evolution.json(); //evolves_from_species['name']
  return evolutionData;
};

//RENDER INFO ON CARD
const renderInfo = function (data) {
  const [ability1, ability2] = data.abilities;
  const [type1, type2] = data.types;
  //POKEMON NAME
  pokeName.innerHTML = data.name[0].toUpperCase() + data.name.slice(1);

  document.querySelector(
    "h2"
  ).innerHTML = `Showing results for ${pokeName.innerHTML}`;

  //POKEMON IMAGE
  pokeImg.src = data.sprites.front_default;

  //POKEMON TYPE
  pokeType.innerHTML = `<strong>Type: </strong>${type1.type["name"]}${
    !type2 ? "" : "," + type2.type["name"]
  }`;

  //FIRST ABILITY
  firstAbility.innerHTML = `<strong>Ability 1: </strong>${ability1.ability["name"]}`;

  //SECOND ABILITY
  if (data.abilities.length > 1) {
    secondAbility.innerHTML = `<strong>Ability 2: </strong> ${ability2.ability["name"]}`;
  } else {
    secondAbility.textContent = " ";
  }
};

//ADD LOCATIONS AS A LIST (BUGGY. LIST GOES PAST HEIGHT OF LOCATIONS CONTAINER)
function addLocations(name) {
  let li = document.createElement("li");
  li.textContent = name.replaceAll("-", " ");
  return li;
}

//GET LOCATION FROM API
const getLocation = async function (data) {
  const location = await fetch(data.location_area_encounters);
  const locationData = await location.json();

  let locationList = [];
  let arr = [];

  //PLACING LOCATION DATA INTO LOCATION LIST ARRAY TO BE USED
  locationData.forEach(function (location) {
    arr.push(location.location_area["name"]);
  });

  locationList = arr.slice(0, 100);
  // console.log(locationList);
  return locationList;
};

//MAIN POKEMON SEARCH FUNCTION
const searchPokemon = async function () {
  let pokemon = document.querySelector(".chosenPokemon").value.toLowerCase();
  console.log(pokemon);
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    //CURRENT POKEMON DATA
    const pokeInfo = await data.json();

    //LOCATION DATA
    const locationArray = await getLocation(pokeInfo);

    //PREVIOUS EVOLUTION DATA
    const evoName = await showEvo(pokeInfo);

    // const location = await fetch(pokeInfo.location_area_encounters);
    // const locationData = await location.json();
    // console.log(locationData);
    // const locationArray = [];
    // locationData.forEach(function (location) {
    //   locationArray.push(location.location_area["name"]);
    // });
    // const pokeLocationList = locationArray.forEach(function (location) {
    //   console.log(location);
    //   locationDescription.appendChild(addLocations(location));
    // });

    //RENDERING EVOLUTION DATA
    !evoName.evolves_from_species
      ? (pokeEvolution.innerHTML = ` No previous evolution`)
      : (pokeEvolution.innerHTML = `<strong>Evolves from: </strong>${evoName.evolves_from_species["name"]}`);

    //RENDERING LOCATION DATA
    locationArray.length === 0
      ? (locationsData.innerHTML = "No location known")
      : (locationsData.innerHTML = `${locationArray}`);

    //RENDERING POKEMON INFO
    renderInfo(pokeInfo);

    //CLEARING INPUT ONCE SEARCH IS COMPLETE
    document.querySelector(".chosenPokemon").value = "";
  } catch (err) {
    console.error(err);
    document.querySelector(
      "h2"
    ).textContent = `Failed to find Pokemon:${pokemon}. Either system failed to look for data or ${pokemon} does not exist. Please try again.`;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Step 4(COMPLETE): Either use onClick property or event listener to pass the pokeSearch function to search button.

//Step 5(NO NEED.HTML COTENT CHANGES EVERY NEW SEARCH): Either make a reset button that replaces search button or make a reset button that clears current page.
//Note: Only do this if current rendered info is not going away.

//////////////////////////////////////////////////////////////////////////
//Guide for step 3:
//Make an async await function to initiate PokeSearch

//Get API for pokemon and use fetch to get data from it.

//Make HTML format for the card and insert data from API into the HTML
//may want to use insertAdjacentHTML. Store html format in const html.

//Store the format into a separate function (renderPokemon) and call it within pokeSearch function

//Implement error messages and render it onto the HTML page. Make a function that
//makes the error message; ie. errMessage

//Here are some initial notes

//ERROR MESSAGE
// const getError = function (msg) {
//     countriesContainer.insertAdjacentText('beforeend', msg);
//     countriesContainer.style.opacity = 1;
//   };

//ACTUAL FUNCTION TO LOOK FOR POKEMON
//   let pokeArray = [];
//   const searchPokemon = async function (pokemon) {
//     try {
//THE POKEMON API IS DOWN BELOW
//       const getPokemon = await fetch(
//         `https://pokeapi.co/api/v2/pokemon/${pokemon}/`
//       );
//       const objectPokemon = await getPokemon.json();
//       console.log(objectPokemon);
//       console.log(objectPokemon.name); -> NAME OF POKEMON
//       console.log(objectPokemon.types[0].type['name']); -> POKEMON TYPE
//       // console.log(objectPokemon.abilities[0].ability['name']); IGNORE
//       const array1 = objectPokemon.abilities.forEach(abilityName =>
//         pokeArray.push(abilityName.ability['name']) -> LISTS ALL ABILITIES OF POKEMON
//       );
//       console.log(...pokeArray); -> USE SPREAD OPERATOR WHEN INPUTTING ABILITIES IN HTML
//       console.log(objectPokemon.sprites.front_default); THIS IS IMG PATH FOR SPRITE/IMG FOR POKEMON
//       const [ability1, ability2] = objectPokemon.abilities; YOU CAN USE DESTRUCTURING OR FOR EACH LOOP TO GET ABILTIES
//       console.log(ability1.ability['name']);
//     } catch (err) {
//       getError('Pokemon not found');
//     }
//   };

//   searchPokemon('pikachu');
