// ============================================================
// EXPEDITION 2028
// dialogue.js
// ============================================================


// ------------------------------------------------------------
// ÉTAT DU DIALOGUE
// ------------------------------------------------------------

let dialogueIndex = 0;


// ------------------------------------------------------------
// DÉMARRER UN DIALOGUE
// ------------------------------------------------------------

function startDialogue(lines) {

  // On stocke le dialogue actuellement joué.

  game.dialogue = lines;

  // On commence à la première ligne.

  dialogueIndex = 0;

  showDialogue();

}


// ------------------------------------------------------------
// AFFICHER LA LIGNE ACTUELLE
// ------------------------------------------------------------

function showDialogue() {

  // Sécurité

  if (!game.dialogue) {
    return;
  }


  const line =
    game.dialogue[dialogueIndex];


  dialogueName.textContent =
    line.name;

  dialogueText.textContent =
    line.text;


  dialogueBox.classList.remove(
    "hidden"
  );

}


// ------------------------------------------------------------
// LIGNE SUIVANTE
// ------------------------------------------------------------

function nextDialogue() {

  // Si aucun dialogue n'est ouvert,
  // on ne fait rien.

  if (!game.dialogue) {
    return;
  }


  dialogueIndex++;


  // Si on arrive après la dernière ligne,
  // on ferme le dialogue.

  if (
    dialogueIndex >=
    game.dialogue.length
  ) {

    closeDialogue();

    return;

  }


  showDialogue();

}


// ------------------------------------------------------------
// FERMER LE DIALOGUE
// ------------------------------------------------------------

function closeDialogue() {

  game.dialogue = null;

  dialogueIndex = 0;

  dialogueBox.classList.add(
    "hidden"
  );

}
