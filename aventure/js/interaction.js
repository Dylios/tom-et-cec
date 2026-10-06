// ============================================================
// EXPEDITION 2028
// interaction.js
// ============================================================


// ------------------------------------------------------------
// ÉTAT DE L'INTERACTION
// ------------------------------------------------------------

let interactionTarget = null;


// ------------------------------------------------------------
// DISTANCE ENTRE DEUX POINTS
// ------------------------------------------------------------

function getDistance(a, b) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


// ------------------------------------------------------------
// MISE À JOUR DE L'INTERACTION
// ------------------------------------------------------------

function updateInteraction() {

  interactionTarget = null;


  // ----------------------------------------------------------
  // LIVRE CENTRAL
  // ----------------------------------------------------------

  const book = {
    x: 11 * TILE_SIZE + TILE_SIZE / 2,
    y: 7 * TILE_SIZE + TILE_SIZE / 2
  };


  const distance =
    getDistance(player, book);


  if (distance < 65) {

    interactionTarget = "book";

    interactionHint.classList.remove("hidden");

    return;

  }


  // ----------------------------------------------------------
  // RIEN À PROXIMITÉ
  // ----------------------------------------------------------

  interactionHint.classList.add("hidden");

}


// ------------------------------------------------------------
// INTERACTION
// ------------------------------------------------------------

function interact() {

  if (!interactionTarget) {
    return;
  }


  // ----------------------------------------------------------
  // LIVRE
  // ----------------------------------------------------------

  if (interactionTarget === "book") {

    interactWithBook();

  }

}


// ------------------------------------------------------------
// INTERACTION AVEC LE LIVRE
// ------------------------------------------------------------

function interactWithBook() {

  if (game.dialogue) {
    return;
  }


  startDialogue([
    {
      name: "Livre",
      text: "Les pages sont couvertes d'une écriture ancienne."
    },

    {
      name: "Livre",
      text: "Certaines phrases semblent avoir été effacées."
    },

    {
      name: "Livre",
      text: "Une seule ligne reste parfaitement lisible."
    },

    {
      name: "Livre",
      text: "« Toute expédition commence avant même que ses voyageurs sachent où ils vont. »"
    }
  ]);

}
