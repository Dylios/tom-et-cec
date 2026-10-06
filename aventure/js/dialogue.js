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

  game.dialogue = lines;

  dialogueIndex = 0;

  showDialogue();

}


// ------------------------------------------------------------
// AFFICHER LE DIALOGUE
// ------------------------------------------------------------

function showDialogue() {

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
// PASSER À LA LIGNE SUIVANTE
// ------------------------------------------------------------

function nextDialogue() {

  dialogueIndex++;


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
