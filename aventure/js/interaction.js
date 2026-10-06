// ============================================================
// EXPEDITION 2028
// interaction.js
// ============================================================


let interactionTarget = null;


// ------------------------------------------------------------
// DISTANCE
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
// RECHERCHER L'OBJET LE PLUS PROCHE
// ------------------------------------------------------------

function getNearestInteractiveObject() {

  let nearest = null;
  let nearestDistance = Infinity;


  for (const object of MAP_OBJECTS) {

    if (!object.interactive) {
      continue;
    }


    const position =
      getObjectPosition(object);


    const distance =
      getDistance(
        player,
        position
      );


    if (
      distance < 65 &&
      distance < nearestDistance
    ) {

      nearest = object;

      nearestDistance = distance;

    }

  }


  return nearest;

}


// ------------------------------------------------------------
// MISE À JOUR
// ------------------------------------------------------------

function updateInteraction() {

  interactionTarget =
    getNearestInteractiveObject();


  if (interactionTarget) {

    interactionHint.classList.remove(
      "hidden"
    );

  } else {

    interactionHint.classList.add(
      "hidden"
    );

  }

}


// ------------------------------------------------------------
// INTERACTION
// ------------------------------------------------------------

function interact() {

  if (!interactionTarget) {
    return;
  }


  switch (interactionTarget.type) {

    case "book":

      interactWithBook();

      break;


    case "npc":

      interactWithNPC(
        interactionTarget
      );

      break;


    default:

      console.warn(
        "Interaction inconnue :",
        interactionTarget.type
      );

  }

}

// ------------------------------------------------------------
// INTERACTION AVEC UN PNJ
// ------------------------------------------------------------

function interactWithNPC(npc) {

  if (game.dialogue) {
    return;
  }


  const character =
    CHARACTERS[npc.characterId];


  if (!character) {

    console.warn(
      "Personnage introuvable :",
      npc.characterId
    );

    return;

  }


  startDialogue(
    character.dialogue
  );

}


// ------------------------------------------------------------
// LIVRE
// ------------------------------------------------------------

function interactWithBook() {

  if (game.dialogue) {
    return;
  }


  startDialogue([

    {
      name: "Livre",
      text:
        "Les pages sont couvertes d'une écriture ancienne."
    },

    {
      name: "Livre",
      text:
        "Certaines phrases semblent avoir été effacées."
    },

    {
      name: "Livre",
      text:
        "Une seule ligne reste parfaitement lisible."
    },

    {
      name: "Livre",
      text:
        "« Toute expédition commence avant même que ses voyageurs sachent où ils vont. »"
    }

  ]);

}
