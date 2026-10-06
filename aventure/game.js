/* =========================================================
   EXPEDITION 2028 — LE DERNIER CHAPITRE
   Prototype V0.1
========================================================= */


/* =========================================================
   DOM
========================================================= */

const titleScreen = document.getElementById("title-screen");
const prologueScreen = document.getElementById("prologue-screen");
const gameScreen = document.getElementById("game-screen");

const startButton = document.getElementById("start-button");
const enterWorldButton = document.getElementById("enter-world-button");

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const dialogueBox = document.getElementById("dialogue-box");
const dialogueName = document.getElementById("dialogue-name");
const dialogueText = document.getElementById("dialogue-text");

const interactionHint = document.getElementById("interaction-hint");


/* =========================================================
   GAME STATE
========================================================= */

const game = {

  running: false,

  keys: {},

  player: {
    x: 480,
    y: 360,

    width: 24,
    height: 30,

    speed: 3
  },

  npc: {
    x: 480,
    y: 190,

    width: 24,
    height: 30
  },

  dialogue: null,

  interactionTarget: null

};


/* =========================================================
   START
========================================================= */

startButton.addEventListener("click", () => {

  titleScreen.classList.remove("active");

  prologueScreen.classList.add("active");

});


enterWorldButton.addEventListener("click", () => {

  prologueScreen.classList.remove("active");

  gameScreen.classList.add("active");

  startGame();

});


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", event => {

  game.keys[event.key.toLowerCase()] = true;

  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
      .includes(event.key.toLowerCase())
  ) {
    event.preventDefault();
  }

  if (event.key.toLowerCase() === "e") {

    interact();

  }

});


document.addEventListener("keyup", event => {

  game.keys[event.key.toLowerCase()] = false;

});


/* =========================================================
   START GAME
========================================================= */

function startGame() {

  game.running = true;

  requestAnimationFrame(gameLoop);

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop() {

  if (!game.running) {
    return;
  }

  update();

  draw();

  requestAnimationFrame(gameLoop);

}


/* =========================================================
   UPDATE
========================================================= */

function update() {

  if (game.dialogue) {
    return;
  }

  let dx = 0;
  let dy = 0;


  /* ----- movement ----- */

  if (
    game.keys["arrowup"] ||
    game.keys["z"] ||
    game.keys["w"]
  ) {
    dy -= 1;
  }

  if (
    game.keys["arrowdown"] ||
    game.keys["s"]
  ) {
    dy += 1;
  }

  if (
    game.keys["arrowleft"] ||
    game.keys["q"] ||
    game.keys["a"]
  ) {
    dx -= 1;
  }

  if (
    game.keys["arrowright"] ||
    game.keys["d"]
  ) {
    dx += 1;
  }


  /* ----- normalize diagonal movement ----- */

  if (dx !== 0 && dy !== 0) {

    dx *= .7071;
    dy *= .7071;

  }


  game.player.x += dx * game.player.speed;
  game.player.y += dy * game.player.speed;


  /* ----- boundaries ----- */

  const margin = 35;

  game.player.x = Math.max(
    margin,
    Math.min(canvas.width - margin, game.player.x)
  );

  game.player.y = Math.max(
    margin,
    Math.min(canvas.height - margin, game.player.y)
  );


  /* ----- interaction ----- */

  const distance = getDistance(
    game.player,
    game.npc
  );

  if (distance < 75) {

    game.interactionTarget = "npc";

    interactionHint.classList.remove("hidden");

  } else {

    game.interactionTarget = null;

    interactionHint.classList.add("hidden");

  }

}


/* =========================================================
   DRAW
========================================================= */

function draw() {

  drawRoom();

  drawNPC();

  drawPlayer();

}


/* =========================================================
   ROOM
========================================================= */

function drawRoom() {

  /* floor */

  ctx.fillStyle = "#8c765e";
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /* floor tiles */

  ctx.strokeStyle = "rgba(50,40,30,.18)";
  ctx.lineWidth = 1;

  const tileSize = 48;

  for (
    let x = 0;
    x < canvas.width;
    x += tileSize
  ) {

    for (
      let y = 0;
      y < canvas.height;
      y += tileSize
    ) {

      ctx.strokeRect(
        x,
        y,
        tileSize,
        tileSize
      );

    }

  }


  /* walls */

  ctx.fillStyle = "#3a2c24";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    38
  );

  ctx.fillRect(
    0,
    0,
    38,
    canvas.height
  );

  ctx.fillRect(
    canvas.width - 38,
    0,
    38,
    canvas.height
  );

  ctx.fillRect(
    0,
    canvas.height - 38,
    canvas.width,
    38
  );


  /* bookshelves */

  drawBookshelf(75, 65);
  drawBookshelf(75, 235);

  drawBookshelf(
    canvas.width - 185,
    65
  );

  drawBookshelf(
    canvas.width - 185,
    235
  );


  /* table */

  ctx.fillStyle = "#4c3627";

  ctx.fillRect(
    350,
    290,
    260,
    90
  );

  ctx.fillStyle = "#705642";

  ctx.fillRect(
    365,
    305,
    230,
    60
  );


  /* book */

  ctx.fillStyle = "#315a72";

  ctx.fillRect(
    470,
    325,
    28,
    35
  );


  /* door */

  ctx.fillStyle = "#2c211b";

  ctx.fillRect(
    445,
    canvas.height - 70,
    70,
    32
  );

}


/* =========================================================
   BOOKSHELF
========================================================= */

function drawBookshelf(x, y) {

  ctx.fillStyle = "#4a3426";

  ctx.fillRect(
    x,
    y,
    110,
    135
  );


  ctx.fillStyle = "#705642";

  ctx.fillRect(
    x + 8,
    y + 10,
    94,
    8
  );

  ctx.fillRect(
    x + 8,
    y + 57,
    94,
    8
  );

  ctx.fillRect(
    x + 8,
    y + 104,
    94,
    8
  );


  const bookColors = [
    "#315a72",
    "#49634f",
    "#a88a52",
    "#7a4e42",
    "#594b63"
  ];


  for (let row = 0; row < 3; row++) {

    for (let i = 0; i < 7; i++) {

      ctx.fillStyle =
        bookColors[(i + row) % bookColors.length];

      ctx.fillRect(
        x + 12 + i * 12,
        y + 20 + row * 47,
        8,
        30
      );

    }

  }

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer() {

  const p = game.player;

  /* shadow */

  ctx.fillStyle = "rgba(0,0,0,.25)";

  ctx.beginPath();

  ctx.ellipse(
    p.x,
    p.y + 15,
    13,
    6,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* body */

  ctx.fillStyle = "#315a72";

  ctx.fillRect(
    p.x - 10,
    p.y - 2,
    20,
    20
  );


  /* head */

  ctx.fillStyle = "#d4a47b";

  ctx.fillRect(
    p.x - 8,
    p.y - 18,
    16,
    16
  );


  /* hair */

  ctx.fillStyle = "#292722";

  ctx.fillRect(
    p.x - 8,
    p.y - 20,
    16,
    6
  );

}


/* =========================================================
   NPC
========================================================= */

function drawNPC() {

  const p = game.npc;

  /* shadow */

  ctx.fillStyle = "rgba(0,0,0,.25)";

  ctx.beginPath();

  ctx.ellipse(
    p.x,
    p.y + 15,
    13,
    6,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* body */

  ctx.fillStyle = "#49634f";

  ctx.fillRect(
    p.x - 10,
    p.y - 2,
    20,
    20
  );


  /* head */

  ctx.fillStyle = "#d4a47b";

  ctx.fillRect(
    p.x - 8,
    p.y - 18,
    16,
    16
  );


  /* hair */

  ctx.fillStyle = "#594033";

  ctx.fillRect(
    p.x - 8,
    p.y - 20,
    16,
    7
  );

}


/* =========================================================
   INTERACTION
========================================================= */

function interact() {

  if (
    game.interactionTarget !== "npc"
  ) {
    return;
  }


  if (!game.dialogue) {

    startDialogue();

  }

  else {

    nextDialogue();

  }

}


/* =========================================================
   DIALOGUE
========================================================= */

const dialogue = [

  {
    name: "???",
    text: "Tu es enfin arrivé."
  },

  {
    name: "Voyageur",
    text: "Où suis-je ?"
  },

  {
    name: "???",
    text: "Dans une histoire."
  },

  {
    name: "Voyageur",
    text: "Je ne me souviens pas avoir demandé à en faire partie."
  },

  {
    name: "???",
    text: "Personne ne le demande vraiment."
  },

  {
    name: "???",
    text: "Mais puisque tu es là..."
  },

  {
    name: "???",
    text: "Il va falloir avancer."
  }

];


let dialogueIndex = 0;


function startDialogue() {

  game.dialogue = true;

  dialogueIndex = 0;

  showDialogue();

}


function showDialogue() {

  const line = dialogue[dialogueIndex];

  dialogueName.textContent = line.name;

  dialogueText.textContent = line.text;

  dialogueBox.classList.remove("hidden");

}


function nextDialogue() {

  dialogueIndex++;


  if (
    dialogueIndex >= dialogue.length
  ) {

    closeDialogue();

    return;

  }


  showDialogue();

}


function closeDialogue() {

  game.dialogue = null;

  dialogueBox.classList.add("hidden");

}


/* =========================================================
   UTILITIES
========================================================= */

function getDistance(a, b) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}
