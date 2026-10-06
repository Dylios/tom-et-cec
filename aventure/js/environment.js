// ============================================================
// EXPEDITION 2028
// environment.js
// Décor pixel-art de la bibliothèque
// ============================================================

const ENV_PATH = "assets/environment/";

const ENV = {
  floor: [
    loadEnvironmentImage("floor_wood.png"),
    loadEnvironmentImage("floor_wood_diag.png"),
    loadEnvironmentImage("floor_pattern.png"),
    loadEnvironmentImage("floor_pattern2.png")
  ],

  carpet: loadEnvironmentImage("carpet.png"),
  wall: loadEnvironmentImage("wall_panel.png"),
  bookshelf: loadEnvironmentImage("bookshelf.png"),
  fireplace: loadEnvironmentImage("fireplace.png"),
  cabinet: loadEnvironmentImage("cabinet.png"),
  plant: loadEnvironmentImage("plant.png"),
  table: loadEnvironmentImage("table.png"),
  chair: loadEnvironmentImage("chair.png"),
  armchair: loadEnvironmentImage("armchair.png"),
  globe: loadEnvironmentImage("globe.png"),
  lamp: loadEnvironmentImage("lamp.png"),
  books: loadEnvironmentImage("books_stack.png"),
  map: loadEnvironmentImage("map.png"),
  book: loadEnvironmentImage("book.png")
};

function loadEnvironmentImage(file) {
  const image = new Image();
  image.src = ENV_PATH + file;
  return image;
}

function drawEnvironmentImage(
  ctx,
  image,
  x,
  y,
  width,
  height
) {
  if (!image.complete || !image.naturalWidth) {
    return;
  }

  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height
  );
}

// ------------------------------------------------------------
// SOL
// ------------------------------------------------------------

function drawFloorTile(ctx, x, y) {
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);

  const index =
    Math.abs(col * 17 + row * 31) % ENV.floor.length;

  drawEnvironmentImage(
    ctx,
    ENV.floor[index],
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );
}

// ------------------------------------------------------------
// MUR
// ------------------------------------------------------------

function drawWall(ctx, x, y) {
  drawEnvironmentImage(
    ctx,
    ENV.wall,
    x,
    y,
    TILE_SIZE,
    TILE_SIZE
  );
}

// ------------------------------------------------------------
// BIBLIOTHÈQUE
// ------------------------------------------------------------

function drawBookshelf(ctx, x, y) {
  drawEnvironmentImage(
    ctx,
    ENV.bookshelf,
    x - 1,
    y - 2,
    TILE_SIZE + 2,
    TILE_SIZE + 2
  );
}

// ------------------------------------------------------------
// TABLE
// ------------------------------------------------------------

function drawTable(ctx, x, y) {
  drawEnvironmentImage(
    ctx,
    ENV.table,
    x - 20,
    y - 10,
    80,
    45
  );
}

// ------------------------------------------------------------
// FAUTEUIL
// ------------------------------------------------------------

function drawArmchair(ctx, x, y) {
  drawEnvironmentImage(
    ctx,
    ENV.armchair,
    x - 22,
    y - 24,
    44,
    50
  );
}

// ------------------------------------------------------------
// LIVRE
// ------------------------------------------------------------

function drawBook(ctx, x, y) {
  drawEnvironmentImage(
    ctx,
    ENV.book,
    x - 20,
    y - 18,
    40,
    43
  );
}

// ------------------------------------------------------------
// DÉCOR SUPPLÉMENTAIRE
// ------------------------------------------------------------

function drawEnvironmentDecor(ctx) {
  // Ces éléments sont décoratifs uniquement.
  // Ils ne modifient pas les collisions.

  // Tapis central
  drawEnvironmentImage(
    ctx,
    ENV.carpet,
    360,
    250,
    240,
    100
  );

  // Plante à gauche
  drawEnvironmentImage(
    ctx,
    ENV.plant,
    20,
    380,
    42,
    54
  );

  // Globe à droite
  drawEnvironmentImage(
    ctx,
    ENV.globe,
    875,
    340,
    55,
    72
  );

  // Petite lampe près du fauteuil
  drawEnvironmentImage(
    ctx,
    ENV.lamp,
    210,
    250,
    28,
    45
  );
}
