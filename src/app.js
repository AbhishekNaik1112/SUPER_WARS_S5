const PLAYERS = [
  "Spiderman",
  "Captain America",
  "Wonderwoman",
  "Popcorn",
  "Gemwoman",
  "Bolt",
  "Antwoman",
  "Mask",
  "Tiger",
  "Captain",
  "Catwoman",
  "Fish",
  "Hulk",
  "Ninja",
  "Black Cat",
  "Volverine",
  "Thor",
  "Slayer",
  "Vader",
  "Slingo",
];

// Player Class
class Player {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.image = `images/super-${id + 1}.png`;
    this.strength = this.getRandomStrength();
    this.type = type;
    this.selected = false;
    this.wins = 0;
  }

  // Get random strength
  getRandomStrength = () => Math.ceil(Math.random() * 100);

  // Create a player for displaying
  view = () => {
    const player = document.createElement("div");
    player.classList.add("player");
    player.setAttribute("data-id", this.id);
    if (this.selected === true) player.classList.add("selected");
    const image = document.createElement("img");
    image.setAttribute("src", this.image);
    const name = document.createElement("div");
    name.textContent = this.name;
    const strength = document.createElement("div");
    strength.textContent = this.strength;
    strength.className = "strength";
    player.append(image, name, strength);
    return player;
  };
}

// Superwar Class
class Superwar {
  constructor(players) {
    this.players = players.map((player, i) => {
      const type = i % 2 === 0 ? "hero" : "villain";
      return new Player(i, player, type);
    });
    this.score = { hero: 0, villain: 0 };
    this.strength = { hero: 0, villain: 0 };
    Array.from(document.getElementsByClassName("team")).forEach((elem) =>
      elem.addEventListener("click", (e) => {
        this.handleSelection(e.target);
      })
    );
  }

  // Display players in HTML
  viewPlayers = () => {
    let team = document.getElementById("heroes");
    team.innerHTML = "";
    let fragment = this.buildPlayers("hero");
    team.append(fragment);

    team = document.getElementById("villains");
    team.innerHTML = "";
    fragment = this.buildPlayers("villain");
    team.append(fragment);
  };

  // Build players fragment
  buildPlayers = (type) => {
    const fragment = document.createDocumentFragment();
    this.filterPlayers(type).forEach((player) =>
      fragment.append(player.view())
    );
    return fragment;
  };

  // Filter Players based on type
  filterPlayers = (type) =>
    this.players.filter((player) => player.type === type);

  // Handle player clicks
  handleSelection = (target) => {
    if (!target.classList.contains("player")) target = target.parentNode;
    if (!target.hasAttribute("data-id")) return;

    const selectedId = target.getAttribute("data-id");
    const selectedPlayer = this.players[selectedId];
    this.players
      .filter((player) => player.type === selectedPlayer.type)
      .forEach((player) => (player.selected = false));
    selectedPlayer.selected = true;

    if (this.isFight(selectedPlayer.strength) === "clash") this.fight();
    else this.viewPlayers();
  };

  // Progression 1: Check for fight
  isFight = (strength) => (strength > 0 ? "clash" : "peace");

  // Fight
  fight = () => {
    const score = this.calculateScore();
    const scoreCard = document.getElementById("score");
    scoreCard.innerHTML = `${score.hero} - ${score.villain}`;

    if (this.checkWin() !== "endure")
      setTimeout(() => this.announceWinner(score), 100);
  };

  // Progression 2: Calculate score
  calculateScore = () => {
    const result = this.checkWin();
    if (result === "hero") return { hero: 1, villain: 0 };
    else if (result === "villain") return { hero: 0, villain: 1 };
    return this.score;
  };

  // Progression 3: Check whether there is a win
  checkWin = () => {
    const heroStrength = this.totalStrength("hero");
    const villainStrength = this.totalStrength("villain");

    if (heroStrength > villainStrength) return "hero";
    else if (heroStrength === villainStrength) return "endure";
    else return "villain";
  };

  // Progression 4: Find total strength of a team
  totalStrength = (type) =>
    this.players
      .filter((player) => player.type === type)
      .reduce((total, player) => total + player.strength, 0);

  // Announce the winner
  announceWinner = (score) => {
    if (score.hero === score.villain) alert("It's a draw!");
    else if (score.hero > score.villain) alert("Heroes Win!");
    else alert("Villains Win!");
    location.reload();
  };
}

window.onload = () => {
  const superwar = new Superwar(PLAYERS);
  superwar.viewPlayers();
};
