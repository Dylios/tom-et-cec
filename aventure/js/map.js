// ============================================================
// EXPEDITION 2028
// map.js
// ============================================================

const TILE_SIZE = 40;

// ------------------------------------------------------------
// SPRITES DES PERSONNAGES
// ------------------------------------------------------------

const CHARACTER_SPRITES = {
  thomas: loadCharacterSprite("assets/characters/thomas_sheet.png"),
  cecile: loadCharacterSprite("assets/characters/cecile_sheet.png"),
  tiChat: loadCharacterSprite("assets/characters/ti-chat_sheet.png")
};

function loadCharacterSprite(src) {
  const image = new Image();
  image.src = src;
  return image;
}

// Chaque case du spritesheet fait 48 x 64.
// Pour l'instant on utilise la première frame "idle bas".
const SPRITE_FRAME_WIDTH = 48;
const SPRITE_FRAME_HEIGHT = 64;
const SPRITE_DRAW_WIDTH = 32;
const SPRITE_DRAW_HEIGHT = 40;

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

  {
    id: "main-book",
    type: "book",
    col: 11,
    row: 7,
    interactive: true
  },

  {
    id: "cecile",
    type: "npc",
    characterId: "cecile",
    col: 5,
    row: 5,
    interactive: true
  },

  {
    id: "thomas",
    type: "npc",
    characterId: "thomas",
    col: 18,
    row: 5,
    interactive: true
  },

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
    x:
      object.col * TILE_SIZE +
      TILE_SIZE / 2,

    y:
      object.row * TILE_SIZE +
      TILE_SIZE / 2
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

      const tile =
        MAP[row][col];

      const x =
        col * TILE_SIZE;

      const y =
        row * TILE_SIZE;

      drawFloorTile(
        ctx,
        x,
        y
      );

      if (
        tile === TILE_TYPES.WALL
      ) {
        drawWall(
          ctx,
          x,
          y
        );
      }

      if (
        tile === TILE_TYPES.BOOKSHELF
      ) {
        drawBookshelf(
          ctx,
          x,
          y
        );
      }

      if (
        tile === TILE_TYPES.TABLE
      ) {
        drawTable(
          ctx,
          x,
          y
        );
      }

      if (
        tile === TILE_TYPES.ARMCHAIR
      ) {
        drawArmchair(
          ctx,
          x,
          y
        );
      }

      if (
        tile === TILE_TYPES.BOOK
      ) {
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

  ctx.fillStyle = "#514337";

  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

  ctx.strokeStyle =
    "rgba(30,22,17,.25)";

  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.moveTo(
    x,
    y + 13
  );

  ctx.lineTo(
    x + TILE_SIZE,
    y + 13
  );

  ctx.moveTo(
    x,
    y + 27
  );

  ctx.lineTo(
    x + TILE_SIZE,
    y + 27
  );

  ctx.stroke();

  ctx.fillStyle =
    "rgba(255,255,255,.025)";

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

  ctx.fillStyle = "#241a15";

  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

  ctx.fillStyle = "#33251d";

  ctx.fillRect(
    x + 4,
    y + 5,
    TILE_SIZE - 8,
    TILE_SIZE - 8
  );

  ctx.strokeStyle = "#624733";

  ctx.strokeRect(
    x + 5,
    y + 6,
    TILE_SIZE - 10,
    TILE_SIZE - 11
  );

  ctx.fillStyle =
    "rgba(0,0,0,.25)";

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

  ctx.fillStyle = "#382319";

  ctx.fillRect(
    x + 2,
    y + 1,
    TILE_SIZE - 4,
    TILE_SIZE - 2
  );

  ctx.fillStyle = "#1d1511";

  ctx.fillRect(
    x + 6,
    y + 6,
    TILE_SIZE - 12,
    TILE_SIZE - 8
  );

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

  const books = [
    "#7c4f3c",
    "#49634f",
    "#315a72",
    "#a88a52",
    "#70485a",
    "#5d4938"
  ];

  const positions = [
    8,
    12,
    16,
    20,
    24
  ];

  for (
    let row = 0;
    row < 3;
    row++
  ) {

    for (
      let i = 0;
      i < positions.length;
      i++
    ) {

      ctx.fillStyle =
        books[
          (i + row) %
          books.length
        ];

      const height =
        6 +
        ((i + row) % 3) *
        2;

      ctx.fillRect(
        x + positions[i],
        y + 4 + row * 9,
        3,
        height
      );
    }
  }

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

  ctx.fillStyle =
    "rgba(0,0,0,.3)";

  ctx.fillRect(
    x + 2,
    y + 19,
    TILE_SIZE - 4,
    13
  );

  ctx.fillStyle = "#4a3020";

  ctx.fillRect(
    x + 3,
    y + 7,
    TILE_SIZE - 6,
    20
  );

  ctx.fillStyle = "#65442d";

  ctx.fillRect(
    x + 5,
    y + 9,
    TILE_SIZE - 10,
    12
  );

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

  ctx.fillStyle =
    "rgba(0,0,0,.3)";

  ctx.fillRect(
    x + 5,
    y + 23,
    30,
    7
  );

  ctx.fillStyle = "#385669";

  ctx.fillRect(
    x + 8,
    y + 4,
    24,
    19
  );

  ctx.fillStyle = "#496f82";

  ctx.fillRect(
    x + 6,
    y + 18,
    28,
    12
  );

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

  ctx.fillStyle =
    "rgba(255,255,255,.08)";

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

  ctx.fillStyle =
    "rgba(0,0,0,.3)";

  ctx.fillRect(
    x + 8,
    y + 22,
    25,
    5
  );

  ctx.fillStyle = "#315a72";

  ctx.fillRect(
    x + 9,
    y + 10,
    23,
    14
  );

  ctx.fillStyle = "#e7dcc8";

  ctx.fillRect(
    x + 12,
    y + 12,
    18,
    10
  );

  ctx.fillStyle = "#a88a52";

  ctx.fillRect(
    x + 9,
    y + 10,
    3,
    14
  );

  ctx.fillStyle = "#a88a52";

  ctx.fillRect(
    x + 19,
    y + 15,
    5,
    4
  );
}

// ------------------------------------------------------------
// PNJ
// ------------------------------------------------------------

function drawNPCs(ctx) {

  for (
    const object of MAP_OBJECTS
  ) {

    if (
      object.type !== "npc"
    ) {
      continue;
    }

    const character =
      CHARACTERS[
        object.characterId
      ];

    if (!character) {
      continue;
    }

    const position =
      getObjectPosition(object);

    drawNPC(
      ctx,
      position.x,
      position.y,
      character,
      object.characterId
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
  character,
  characterId
) {

  const sprite =
    CHARACTER_SPRITES[
      characterId
    ];

  // Tant que l'image n'est pas chargée,
  // on conserve l'ancien rendu.
  if (
    !sprite ||
    !sprite.complete ||
    sprite.naturalWidth === 0
  ) {

    drawFallbackNPC(
      ctx,
      x,
      y,
      character
    );

    return;
  }

  // Ombre
  ctx.fillStyle =
    "rgba(0,0,0,.35)";

  ctx.fillRect(
    x - 11,
    y + 10,
    22,
    6
  );

  // Première frame : idle vers le bas
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    sprite,
    0,
    0,
    SPRITE_FRAME_WIDTH,
    SPRITE_FRAME_HEIGHT,
    x - SPRITE_DRAW_WIDTH / 2,
    y - SPRITE_DRAW_HEIGHT + 6,
    SPRITE_DRAW_WIDTH,
    SPRITE_DRAW_HEIGHT
  );
}

// ------------------------------------------------------------
// ANCIEN RENDU DE SECOURS
// ------------------------------------------------------------

function drawFallbackNPC(
  ctx,
  x,
  y,
  character
) {

  ctx.fillStyle =
    "rgba(0,0,0,.35)";

  ctx.fillRect(
    x - 10,
    y + 10,
    20,
    6
  );

  ctx.fillStyle =
    character.color;

  ctx.fillRect(
    x - 10,
    y - 4,
    20,
    18
  );

  ctx.fillStyle =
    "#c79b78";

  ctx.fillRect(
    x - 8,
    y - 16,
    16,
    14
  );

  ctx.fillStyle =
    "#29231f";

  ctx.fillRect(
    x - 8,
    y - 17,
    16,
    5
  );

  if (
    character.name === "Ti Chat"
  ) {
    drawCatEars(
      ctx,
      x,
      y
    );
  }
}

function drawCatEars(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#7d7065";

  ctx.beginPath();

  ctx.moveTo(
    x - 8,
    y - 14
  );

  ctx.lineTo(
    x - 4,
    y - 21
  );

  ctx.lineTo(
    x - 1,
    y - 14
  );

  ctx.fill();

  ctx.beginPath();

  ctx.moveTo(
    x + 1,
    y - 14
  );

  ctx.lineTo(
    x + 5,
    y - 21
  );

  ctx.lineTo(
    x + 8,
    y - 14
  );

  ctx.fill();
}

// ------------------------------------------------------------
// LUMIÈRE AMBIANTE
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
