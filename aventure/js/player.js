const player = {

  x: 480,
  y: 440,

  width: 22,
  height: 28,

  speed: 3,

  direction: "down",

  moving: false
};

function updatePlayer(dx, dy) {

  player.moving = dx !== 0 || dy !== 0;

  if (!player.moving) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    player.direction = dx > 0 ? "right" : "left";
  } else {
    player.direction = dy > 0 ? "down" : "up";
  }

  const nextX = player.x + dx * player.speed;
  const nextY = player.y + dy * player.speed;

  if (canMoveTo(nextX, player.y)) {
    player.x = nextX;
  }

  if (canMoveTo(player.x, nextY)) {
    player.y = nextY;
  }
}

function canMoveTo(x, y) {

  const halfWidth = player.width / 2;
  const halfHeight = player.height / 2;

  const points = [
    [x - halfWidth, y - halfHeight],
    [x + halfWidth, y - halfHeight],
    [x - halfWidth, y + halfHeight],
    [x + halfWidth, y + halfHeight]
  ];

  for (const [px, py] of points) {

    const col = Math.floor(px / TILE_SIZE);
    const row = Math.floor(py / TILE_SIZE);

    if (!isWalkable(col, row)) {
      return false;
    }
  }

  return true;
}

function drawPlayer(ctx) {

  const x = player.x;
  const y = player.y;

  // ombre
  ctx.fillStyle = "rgba(0,0,0,.35)";
  ctx.fillRect(
    x - 10,
    y + 10,
    20,
    6
  );

  // corps
  ctx.fillStyle = "#315a72";
  ctx.fillRect(
    x - 10,
    y - 4,
    20,
    18
  );

  // tête
  ctx.fillStyle = "#c79b78";
  ctx.fillRect(
    x - 8,
    y - 16,
    16,
    14
  );

  // cheveux
  ctx.fillStyle = "#29231f";
  ctx.fillRect(
    x - 8,
    y - 17,
    16,
    5
  );
}
