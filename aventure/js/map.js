// ============================================================
// EXPEDITION 2028
// map.js
// ============================================================

const TILE_SIZE = 40;

const MAP = [
  "########################",
  "#BBBBB...........BBBBBB#",
  "#BBBBB...........BBBBBB#",
  "#BBBBB.....TT....BBBBBB#",
  "#......................#",
  "#....F...............F.#",
  "#......................#",
  "#...........L..........#",
  "#......................#",
  "#....BBBB.........BBBB.#",
  "#....BBBB.........BBBB.#",
  "#......................#",
  "###########..###########"
];

const TILE_TYPES = {
  FLOOR: ".",
  WALL: "#",
  BOOKSHELF: "B",
  TABLE: "T",
  ARMCHAIR: "F",
  BOOK: "L"
};


// ------------------------------------------------------------
// OBJETS DE LA MAP
// ------------------------------------------------------------

const MAP_OBJECTS = [

  // ----------------------------------------------------------
  // LIVRE CENTRAL
  // ----------------------------------------------------------

  {
    id: "main-book",
    type: "book",
    col: 11,
    row: 7,
    interactive: true
  },


  // ----------------------------------------------------------
  // CÉCILE
  // ----------------------------------------------------------

  {
    id: "cecile",
    type: "npc",
    characterId: "cecile",
    col: 5,
    row: 5,
    interactive: true
  },


  // ----------------------------------------------------------
  // THOMAS
  // ----------------------------------------------------------

  {
    id: "thomas",
    type: "npc",
    characterId: "thomas",
    col: 18,
    row: 5,
    interactive: true
  },


  // ----------------------------------------------------------
  // TI CHAT
  // ----------------------------------------------------------

  {
    id: "ti-chat",
    type: "npc",
    characterId: "tiChat",
    col: 17,
    row: 9,
    interactive: true
  }

];


// ------------------------------------------------------------
// RÉCUPÉRER UNE CASE
// ------------------------------------------------------------

function getTile(col, row) {

  if (
    row < 0 ||
    row >= MAP.length ||
    col < 0 ||
    col >= MAP[0].length
  ) {
    return TILE_TYPES.WALL;
  }

  return MAP[row][col];

}


// ------------------------------------------------------------
// CASE TRAVERSABLE
// ------------------------------------------------------------

function isWalkable(col, row) {

  const tile = getTile(col, row);

  return (
    tile === TILE_TYPES.FLOOR ||
    tile === TILE_TYPES.BOOK ||
    tile === TILE_TYPES.ARMCHAIR
  );

}


// ------------------------------------------------------------
// POSITION D'UN OBJET
// ------------------------------------------------------------

function getObjectPosition(object) {

  return {
    x: object.col * TILE_SIZE + TILE_SIZE / 2,
    y: object.row * TILE_SIZE + TILE_SIZE / 2
  };

}


// ------------------------------------------------------------
// DESSIN DE LA MAP
// ------------------------------------------------------------

function drawMap(ctx) {

  for (
    let row = 0;
    row < MAP.length;
    row++
  ) {

    for (
      let col = 0;
      col < MAP[row].length;
      col++
    ) {

      const tile = MAP[row][col];

      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;


      drawFloorTile(
        ctx,
        x,
        y
      );


      if (tile === TILE_TYPES.WALL) {

        drawWall(
          ctx,
          x,
          y
        );

      }


      if (tile === TILE_TYPES.BOOKSHELF) {

        drawBookshelf(
          ctx,
          x,
          y
        );

      }


      if (tile === TILE_TYPES.TABLE) {

        drawTable(
          ctx,
          x,
          y
        );

      }


      if (tile === TILE_TYPES.ARMCHAIR) {

        drawArmchair(
          ctx,
          x,
          y
        );

      }


      if (tile === TILE_TYPES.BOOK) {

        drawBook(
          ctx,
          x,
          y
        );

      }

    }

  }
drawAmbientLight(ctx);
drawNPCs(ctx);
}


// ------------------------------------------------------------
// SOL
// ------------------------------------------------------------

function drawFloorTile(ctx, x, y) {

  // Base du parquet
  ctx.fillStyle = "#514337";
  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

  // Lames du parquet
  ctx.strokeStyle = "rgba(30, 22, 17, .25)";
  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.moveTo(x, y + 13);
  ctx.lineTo(x + TILE_SIZE, y + 13);

  ctx.moveTo(x, y + 27);
  ctx.lineTo(x + TILE_SIZE, y + 27);

  ctx.stroke();

  // Variation légère entre les lames
  ctx.fillStyle = "rgba(255,255,255,.025)";

  ctx.fillRect(
    x + 2,
    y + 2,
    TILE_SIZE - 4,
    4
  );

}

// ------------------------------------------------------------
// MUR
// ------------------------------------------------------------

function drawWall(ctx, x, y) {

  // Bois sombre
  ctx.fillStyle = "#241a15";

  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

  // Panneau intérieur
  ctx.fillStyle = "#33251d";

  ctx.fillRect(
    x + 4,
    y + 5,
    TILE_SIZE - 8,
    TILE_SIZE - 8
  );

  // Ligne de moulure
  ctx.strokeStyle = "#624733";

  ctx.strokeRect(
    x + 5,
    y + 6,
    TILE_SIZE - 10,
    TILE_SIZE - 11
  );

  // Ombre supérieure
  ctx.fillStyle = "rgba(0,0,0,.25)";

  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    5
  );

}

// ------------------------------------------------------------
// BIBLIOTHÈQUE
// ------------------------------------------------------------

function drawBookshelf(ctx, x, y) {

  // Structure en bois
  ctx.fillStyle = "#382319";

  ctx.fillRect(
    x + 2,
    y + 1,
    TILE_SIZE - 4,
    TILE_SIZE - 2
  );


  // Fond sombre
  ctx.fillStyle = "#1d1511";

  ctx.fillRect(
    x + 6,
    y + 6,
    TILE_SIZE - 12,
    TILE_SIZE - 8
  );


  // Trois étagères

  ctx.fillStyle = "#60432e";

  ctx.fillRect(
    x + 5,
    y + 10,
    TILE_SIZE - 10,
    3
  );

  ctx.fillRect(
    x + 5,
    y + 19,
    TILE_SIZE - 10,
    3
  );

  ctx.fillRect(
    x + 5,
    y + 28,
    TILE_SIZE - 10,
    3
  );


  // Livres
  const books = [
    "#7c4f3c",
    "#49634f",
    "#315a72",
    "#a88a52",
    "#70485a",
    "#5d4938"
  ];


  const positions = [
    8, 12, 16, 20, 24
  ];


  for (let row = 0; row < 3; row++) {

    for (let i = 0; i < positions.length; i++) {

      ctx.fillStyle =
        books[(i + row) % books.length];

      const height =
        6 + ((i + row) % 3) * 2;

      ctx.fillRect(
        x + positions[i],
        y + 4 + row * 9,
        3,
        height
      );

    }

  }


  // Montants verticaux
  ctx.fillStyle = "#4a3022";

  ctx.fillRect(
    x + 3,
    y + 1,
    4,
    TILE_SIZE - 2
  );

  ctx.fillRect(
    x + TILE_SIZE - 7,
    y + 1,
    4,
    TILE_SIZE - 2
  );

}


// ------------------------------------------------------------
// TABLE
// ------------------------------------------------------------

function drawTable(ctx, x, y) {

  // Ombre
  ctx.fillStyle = "rgba(0,0,0,.3)";

  ctx.fillRect(
    x + 2,
    y + 19,
    TILE_SIZE - 4,
    13
  );


  // Plateau
  ctx.fillStyle = "#4a3020";

  ctx.fillRect(
    x + 3,
    y + 7,
    TILE_SIZE - 6,
    20
  );


  // Dessus
  ctx.fillStyle = "#65442d";

  ctx.fillRect(
    x + 5,
    y + 9,
    TILE_SIZE - 10,
    12
  );


  // Bord du plateau
  ctx.strokeStyle = "#8a6040";

  ctx.strokeRect(
    x + 5,
    y + 9,
    TILE_SIZE - 10,
    12
  );

}


// ------------------------------------------------------------
// FAUTEUIL
// ------------------------------------------------------------

function drawArmchair(ctx, x, y) {

  // Ombre
  ctx.fillStyle = "rgba(0,0,0,.3)";

  ctx.fillRect(
    x + 5,
    y + 23,
    30,
    7
  );


  // Dossier
  ctx.fillStyle = "#385669";

  ctx.fillRect(
    x + 8,
    y + 4,
    24,
    19
  );


  // Assise
  ctx.fillStyle = "#496f82";

  ctx.fillRect(
    x + 6,
    y + 18,
    28,
    12
  );


  // Accoudoirs
  ctx.fillStyle = "#294352";

  ctx.fillRect(
    x + 4,
    y + 15,
    6,
    16
  );

  ctx.fillRect(
    x + 30,
    y + 15,
    6,
    16
  );


  // Détail central
  ctx.fillStyle = "rgba(255,255,255,.08)";

  ctx.fillRect(
    x + 11,
    y + 8,
    18,
    3
  );

}


// ------------------------------------------------------------
// LIVRE
// ------------------------------------------------------------

function drawBook(ctx, x, y) {

  // Ombre
  ctx.fillStyle = "rgba(0,0,0,.3)";

  ctx.fillRect(
    x + 8,
    y + 22,
    25,
    5
  );


  // Couverture
  ctx.fillStyle = "#315a72";

  ctx.fillRect(
    x + 9,
    y + 10,
    23,
    14
  );


  // Pages
  ctx.fillStyle = "#e7dcc8";

  ctx.fillRect(
    x + 12,
    y + 12,
    18,
    10
  );


  // Reliure
  ctx.fillStyle = "#a88a52";

  ctx.fillRect(
    x + 9,
    y + 10,
    3,
    14
  );


  // Petit symbole
  ctx.fillStyle = "#a88a52";

  ctx.fillRect(
    x + 19,
    y + 15,
    5,
    4
  );

}

// ------------------------------------------------------------
// AmbientLight
// ------------------------------------------------------------

function drawAmbientLight(ctx) {

  const gradient =
    ctx.createRadialGradient(
      480,
      270,
      80,
      480,
      270,
      520
    );

  gradient.addColorStop(
    0,
    "rgba(255,220,160,.08)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,.28)"
  );

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}

// ------------------------------------------------------------
// PNJ
// ------------------------------------------------------------

function drawNPCs(ctx) {

  for (const object of MAP_OBJECTS) {

    if (object.type !== "npc") {
      continue;
    }

    const character =
      CHARACTERS[object.characterId];

    if (!character) {
      continue;
    }

    const position =
      getObjectPosition(object);

    drawNPC(
      ctx,
      position.x,
      position.y,
      character
    );

  }

}


// ------------------------------------------------------------
// DESSIN D'UN PNJ
// ------------------------------------------------------------

function drawNPC(
  ctx,
  x,
  y,
  character
) {

  // Ombre

  ctx.fillStyle =
    "rgba(0,0,0,.35)";

  ctx.fillRect(
    x - 10,
    y + 10,
    20,
    6
  );


  // Corps

  ctx.fillStyle =
    character.color;

  ctx.fillRect(
    x - 10,
    y - 4,
    20,
    18
  );


  // Tête

  ctx.fillStyle =
    "#c79b78";

  ctx.fillRect(
    x - 8,
    y - 16,
    16,
    14
  );


  // Cheveux

  ctx.fillStyle =
    "#29231f";

  ctx.fillRect(
    x - 8,
    y - 17,
    16,
    5
  );


  // Petit indicateur selon le personnage

  if (character.name === "Ti Chat") {

    drawCatEars(
      ctx,
      x,
      y
    );

  }

  function drawCatEars(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#7d7065";

  // Oreille gauche

  ctx.beginPath();

  ctx.moveTo(x - 8, y - 14);
  ctx.lineTo(x - 4, y - 21);
  ctx.lineTo(x - 1, y - 14);

  ctx.fill();


  // Oreille droite

  ctx.beginPath();

  ctx.moveTo(x + 1, y - 14);
  ctx.lineTo(x + 5, y - 21);
  ctx.lineTo(x + 8, y - 14);

  ctx.fill();

}
}
