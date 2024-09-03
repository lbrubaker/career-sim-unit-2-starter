// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2406-CRA-ET-WEB-AM";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const closeModal = document.querySelector("#close-modal");
const mainContainer = document.querySelector("main");
const addPlayerForm = document.querySelector("#new-player-form");

modal.addEventListener("click", function (e) {
  // closes modal when you click outside the content area of the modal
  console.log(e.target.classList);
  if (!e.target.classList.contains("modal-content")) {
    modalContent.classList.remove("modal-content-open");
    modal.classList.remove("modal-open");
    modalContent.innerHTML = "";
  }
});

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    /* Remember, if you're using the modal, when you create the details button,
    in th event handler, create functionality that adds the class 'modal-open' to the modal var and 'modal-content-open' to the
    modalContent var */
    const res = await fetch(`${API_URL}/players`);
    const json = await res.json();
    return json.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const res = await fetch(`${API_URL}/players/${playerId}`);
    const json = await res.json();
    console.log(json.data);
    return json.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const res = await fetch(`${API_URL}/players/`, {
      method: "POST",
      body: JSON.stringify(playerObj),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    console.log(json);
    return json;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const res = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  console.log(playerList);
  const playerCardsHTML = playerList.map((player) => {
    const playerCard = document.createElement("div");
    playerCard.classList.add("player-card");
    const playerImg = document.createElement("img");
    playerImg.src = player.imageUrl;
    playerImg.alt = player.name;
    const playerName = document.createElement("h3");
    playerName.innerText = player.name;
    const detailsButton = document.createElement("button");
    detailsButton.innerText = "See Details";
    detailsButton.addEventListener("click", async function () {
      const playerData = await fetchSinglePlayer(player.id);
      renderSinglePlayer(playerData);
      console.log(playerData);
      modal.classList.add("modal-open");
      modalContent.classList.add("modal-content-open");
    });

    playerCard.replaceChildren(playerImg, playerName, detailsButton);

    return playerCard;
  });

  mainContainer.replaceChildren(...playerCardsHTML);

  // TODO
  // when you add a event handler to the buttons, you need to pass an id of the player
  // to the function renderSinglePlayer or removePlayer
  /*
     ...your code(player=>{
      // more code...
        deleteButton.addEventListener("click", function(){
          removePlayer(player.id);
        })
      })

 */
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  //delete player.team.name;
  const playerName = document.createElement("h3");
  playerName.innerText = player.name;
  const playerBreed = document.createElement("p");
  playerBreed.innerText = player.breed;
  const playerImg = document.createElement("img");
  playerImg.src = player.imageUrl;
  playerImg.alt = player.name;
  playerImg.width = 175;
  const playerId = document.createElement("p");
  playerId.innerText = `Player ID: ${player.id}`;
  const teamName = document.createElement("p");
  teamName.innerText = `Player Team Name: ${
    player.team?.name ? player.team.name : "Unassigned"
  }`;

  const removeButton = document.createElement("button");
  removeButton.innerText = "Remove from Roster";
  removeButton.addEventListener("click", async function (e) {
    e.stopPropagation();
    const result = await removePlayer(player.id);
    if (result.success) {
      alert("player removed successfully!");
      modalContent.classList.remove("modal-content-open");
      modal.classList.remove("modal-open");
      modalContent.innerHTML = "";
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    }
  });

  modalContent.replaceChildren(
    playerName,
    playerBreed,
    playerImg,
    playerId,
    teamName,
    removeButton
  );
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */

const handleAddPlayerSubmit = async (e) => {
  e.preventDefault();
  const name = document.querySelector("#name-input").value;
  const breed = document.querySelector("#breed-input").value;
  const status = document.querySelector("select").value;
  const imageUrl = document.querySelector("#image-url-input").value
    ? document.querySelector("#image-url-input").value
    : "https://r.ddmcdn.com/w_1010/s_f/o_1/cx_0/cy_4/cw_1010/ch_1515/APL/uploads/2019/12/Bert-PBXVI.jpg";

  const newPlayerData = { name, breed, status, imageUrl };
  console.log(newPlayerData);
  const result = await addNewPlayer(newPlayerData);
  if (result.success) {
    alert("Player successfully added! Please see the new player at the bottom");
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  } else {
    alert("Something went wrong.  Try again later");
  }
};

addPlayerForm.addEventListener("submit", handleAddPlayerSubmit);

const renderNewPlayerForm = () => {
  try {
    // UI for name label and input
    // funciton call to createTextInputWithLabel to create a new name and input
    const nameInputLabelObj = createTextInputWithLabel(
      "Player Name",
      "name-input"
    );
    // console.log(nameInputLabelObj.label);
    // console.log(nameInputLabelObj.textInput);

    // const nameLabel = document.createElement("label");
    // nameLabel.innerText = "Player Name";
    // nameLabel.setAttribute("for", "name-input");
    // const nameInput = document.createElement("input");
    // nameLabel.type = "text";
    // nameInput.id = "name-input";

    const breedInputLabelObj = createTextInputWithLabel(
      "Player Breed",
      "breed-input"
    );
    // const breedLabel = document.createElement("label");
    // breedLabel.innerText = "Player Breed";
    // breedLabel.setAttribute("for", "breed-input");
    // const breedInput = document.createElement("input");
    // breedInput.type = "text";
    // breedInput.id = "breed-input";

    const imgLabelObj = createTextInputWithLabel(
      "Image URL",
      "image-url-input"
    );

    const statusInput = document.createElement("select");
    const benchOption = document.createElement("option");
    benchOption.innerText = "bench";
    benchOption.setAttribute("selected", "selected");
    const fieldOption = document.createElement("option");
    fieldOption.innerText = "field";
    statusInput.replaceChildren(benchOption, fieldOption);
    const options = [
      { innerText: "bench", value: "bench" },
      { innerText: "field", value: "field" },
    ];
    const statusMenu = createSelectWithOptions(options, "bench");
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";

    // console.log(imgLabelObj.label);
    // console.log(imgLabelObj.textInput);

    // const imgLabel = document.createElement("label");
    // imgLabel.innerText = "Image URL";
    // imgLabel.setAttribute("for", "image-url-input");
    // const imgInput = document.createElement("input");
    // imgLabel.type = "text";
    // imgInput.id = "image-url-input";

    addPlayerForm.replaceChildren(
      nameInputLabelObj.label,
      nameInputLabelObj.textInput,
      breedInputLabelObj.label,
      breedInputLabelObj.textInput,
      statusMenu,
      imgLabelObj.label,
      imgLabelObj.textInput,
      submitButton
    );
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const createSelectWithOptions = (options, defaultValue) => {
  //options will be an array with{innerText, value}
  const select = document.createElement("select");
  const optionsHTML = options.map((option) => {
    const newOptionTag = document.createElement("option");
    newOptionTag.innerText = option.innerText;
    newOptionTag.value = option.value;
    if (option.value === defaultValue) {
      newOptionTag.setAttribute("selected", "selected");
    }
    return newOptionTag;
  });
  console.log(optionsHTML);
  select.replaceChildren(...optionsHTML);
  return select;
};
// helper function is to create text inputs
const createTextInputWithLabel = (labelInnerText, inputIdentifier) => {
  const label = document.createElement("label");
  label.innerText = labelInnerText;
  label.setAttribute("for", inputIdentifier);
  //create the text input associated withthe label we just created, again withthe proper values
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = inputIdentifier;
  return { label, textInput };
};
/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  console.log(players);
  renderAllPlayers(players);
  const singlePlayer = await fetchSinglePlayer(11923);
  console.log(singlePlayer);
  renderNewPlayerForm();
};

init();
