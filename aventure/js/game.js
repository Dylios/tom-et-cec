// ============================================================
// EXPEDITION 2028
// game.js
// ============================================================


// ------------------------------------------------------------
// DÉTECTION DU TYPE D'APPAREIL
// ------------------------------------------------------------

const isMobile =
  /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);

if (isMobile) {
  document.body.classList.add("mobile-device");
} else {
  document.body.classList.add("desktop-device");
}


// ------------------------------------------------------------
// DOM
// ------------------------------------------------------------

const titleScreen =
  document.getElementById("title-screen");

const prologueScreen =
  document.getElementById("prologue-screen");

const gameScreen =
  document.getElementById("game-screen");

const startButton =
  document.getElementById("start-button");

const enterWorldButton =
  document.getElementById("enter-world-button");

const canvas =
  document.getElementById("game-canvas");

const ctx =
  canvas.getContext("2d");

const dialogueBox =
  document.getElementById("dialogue-box");

const dialogueName =
  document.getElementById("dialogue-name");

const dialogueText =
  document.getElementById("dialogue-text");

const interactionHint =
  document.getElementById("interaction-hint");

const joystick =
  document.getElementById("joystick");

const joystickKnob =
  document.getElementById("joystick-knob");

const actionButton =
  document.getElementById("action-button");


// ------------------------------------------------------------
// ÉTAT DU JEU
// ------------------------------------------------------------

const game = {

  running: false,

  keys: {},

  touch: {
    x: 0,
    y: 0
  },

  interactionTarget: null
};


// ------------------------------------------------------------
// ÉCRANS DE DÉMARRAGE
// ------------------------------------------------------------

startButton.addEventListener("click", () => {

  titleScreen.classList.remove("active");

  prologueScreen.classList.add("active");

});


enterWorldButton.addEventListener("click", () => {

  prologueScreen.classList.remove("active");

  gameScreen.classList.add("active");

  startGame();

});


// ------------------------------------------------------------
// CONTRÔLES CLAVIER
// ------------------------------------------------------------

document.addEventListener("keydown", event => {

  const key =
    event.key.toLowerCase();

  game.keys[key] = true;


  // Empêche le navigateur de faire défiler
  // la page avec les flèches ou espace.

  if (
    [
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      " "
    ].includes(key)
  ) {

    event.preventDefault();

  }


  // Interaction

  if (key === "e") {

    interact();

  }

});


document.addEventListener("keyup", event => {

  const key =
    event.key.toLowerCase();

  game.keys[key] = false;

});


// ------------------------------------------------------------
// JOYSTICK MOBILE
// ------------------------------------------------------------

let joystickPointerId = null;


joystick.addEventListener("pointerdown", event => {

  event.preventDefault();

  joystickPointerId =
    event.pointerId;

  joystick.setPointerCapture(
    joystickPointerId
  );

  updateJoystick(event);

});


joystick.addEventListener("pointermove", event => {

  if (
    event.pointerId !== joystickPointerId
  ) {
    return;
  }

  updateJoystick(event);

});


joystick.addEventListener(
  "pointerup",
  resetJoystick
);


joystick.addEventListener(
  "pointercancel",
  resetJoystick
);


function updateJoystick(event) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  const centerY =
    rect.top + rect.height / 2;


  let dx =
    event.clientX - centerX;

  let dy =
    event.clientY - centerY;


  const maxDistance =
    rect.width * 0.32;

  const distance =
    Math.sqrt(dx * dx + dy * dy);


  if (distance > maxDistance) {

    dx =
      (dx / distance) *
      maxDistance;

    dy =
      (dy / distance) *
      maxDistance;

  }


  game.touch.x =
    dx / maxDistance;

  game.touch.y =
    dy / maxDistance;


  joystickKnob.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;

}


function resetJoystick() {

  joystickPointerId = null;

  game.touch.x = 0;
  game.touch.y = 0;

  joystickKnob.style.transform =
    "translate(-50%, -50%)";

}


// ------------------------------------------------------------
// BOUTON D'ACTION MOBILE
// ------------------------------------------------------------

actionButton.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();

    interact();

  }
);


// ------------------------------------------------------------
// DIALOGUE SUR MOBILE
// ------------------------------------------------------------

dialogueBox.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();

    if (game.dialogue) {

      nextDialogue();

    }

  }
);


// ------------------------------------------------------------
// DÉMARRAGE DU JEU
// ------------------------------------------------------------

function startGame() {

  game.running = true;

  requestAnimationFrame(gameLoop);

}


// ------------------------------------------------------------
// BOUCLE PRINCIPALE
// ------------------------------------------------------------

function gameLoop() {

  if (!game.running) {
    return;
  }


  update();

  draw();


  requestAnimationFrame(gameLoop);

}


// ------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------

function update() {

  // Si un dialogue est ouvert,
  // le joueur ne peut pas bouger.

  if (game.dialogue) {

    return;

  }


  let dx = 0;
  let dy = 0;


  // -------------------------
  // CLAVIER
  // -------------------------

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


  // -------------------------
  // JOYSTICK
  // -------------------------

  if (
    Math.abs(game.touch.x) > 0.15 ||
    Math.abs(game.touch.y) > 0.15
  ) {

    dx += game.touch.x;
    dy += game.touch.y;

  }


  // -------------------------
  // NORMALISATION
  // -------------------------

  const magnitude =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (magnitude > 1) {

    dx /= magnitude;
    dy /= magnitude;

  }


  // -------------------------
  // DÉPLACEMENT
  // -------------------------

  updatePlayer(dx, dy);


  // -------------------------
  // INTERACTION
  // -------------------------

  updateInteraction();

}


// ------------------------------------------------------------
// DRAW
// ------------------------------------------------------------

function draw() {

  // Efface le canvas

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Dessine la map

  drawMap(ctx);


  // Dessine le joueur

  drawPlayer(ctx);


  // Les PNJ seront ajoutés ici ensuite.

  // Exemple futur :
  //
  // drawThomas(ctx);
  // drawCecile(ctx);
  // drawTiChat(ctx);

}
