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

  {
    id: "main-book",
    type: "book",
    col: 11,
    row: 7,
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

}


// ------------------------------------------------------------
// SOL
// ------------------------------------------------------------

function drawFloorTile(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#4b4035";

  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

  ctx.strokeStyle =
    "rgba(30,25,20,.18)";

  ctx.strokeRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

}


// ------------------------------------------------------------
// MUR
// ------------------------------------------------------------

function drawWall(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#211b17";

  ctx.fillRect(
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );

  ctx.fillStyle = "#33271f";

  ctx.fillRect(
    x + 3,
    y + 3,
    TILE_SIZE - 6,
    7
  );

}


// ------------------------------------------------------------
// BIBLIOTHÈQUE
// ------------------------------------------------------------

function drawBookshelf(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#3a2418";

  ctx.fillRect(
    x + 3,
    y + 2,
    TILE_SIZE - 6,
    TILE_SIZE - 4
  );

  ctx.fillStyle = "#1f1712";

  ctx.fillRect(
    x + 7,
    y + 8,
    TILE_SIZE - 14,
    TILE_SIZE - 12
  );


  const colors = [
    "#7d5540",
    "#49634f",
    "#315a72",
    "#a88a52"
  ];


  for (
    let i = 0;
    i < 5;
    i++
  ) {

    ctx.fillStyle =
      colors[i % colors.length];

    ctx.fillRect(
      x + 9 + i * 5,
      y + 11,
      4,
      18
    );

  }

}


// ------------------------------------------------------------
// TABLE
// ------------------------------------------------------------

function drawTable(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#2d1d15";

  ctx.fillRect(
    x + 3,
    y + 9,
    TILE_SIZE - 6,
    TILE_SIZE - 18
  );

  ctx.fillStyle = "#543727";

  ctx.fillRect(
    x + 5,
    y + 11,
    TILE_SIZE - 10,
    TILE_SIZE - 22
  );

}


// ------------------------------------------------------------
// FAUTEUIL
// ------------------------------------------------------------

function drawArmchair(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#315a72";

  ctx.fillRect(
    x + 8,
    y + 7,
    TILE_SIZE - 16,
    TILE_SIZE - 13
  );

  ctx.fillStyle = "#243f50";

  ctx.fillRect(
    x + 11,
    y + 4,
    TILE_SIZE - 22,
    9
  );

}


// ------------------------------------------------------------
// LIVRE
// ------------------------------------------------------------

function drawBook(
  ctx,
  x,
  y
) {

  ctx.fillStyle = "#a88a52";

  ctx.fillRect(
    x + 11,
    y + 12,
    18,
    13
  );

  ctx.fillStyle = "#e7dcc8";

  ctx.fillRect(
    x + 13,
    y + 14,
    14,
    9
  );

}
