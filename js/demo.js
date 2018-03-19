var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var width = height = 800;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Ball = function(x, y, velocX, velocY) {
  this.x = x;
  this.y = y;

  this.velocityX = velocX;
  this.velocityY = velocY;
}

Ball.prototype.reverseVelocity = function() {
  this.velocityX = -this.velocityX;
  this.velocityY = -this.velocityY;
}

Ball.prototype.reflectX = function() {
  this.velocityX = -this.velocityX;
}

Ball.prototype.reflectY = function() {
  this.velocityY = -this.velocityY;
}

Ball.prototype.collidesWith = function(otherBall) {
  var nextX = this.x + this.velocityX;
  var nextY = this.y + this.velocityY;

  var diffX = Math.abs(this.x - otherBall.x);
  var diffY = Math.abs(this.y - otherBall.y);
  if (diffX <= 1 && diffY <= 1) {
    return true;
  }

  return false;
    // If one rectangle is on left side of other
    /*if (nextX > otherBall.x+1 || nextX+1 > otherBall.x) {
        return false;
    }
    // If one rectangle is above other
    if (nextY < otherBall.y+1 || nextY+1 < otherBall.y) {
        return false;
    }
    return true;
*/
/*
  nX-----nX+1
      oX----oX+1
*/
}

Ball.prototype.update = function() {
  this.x += this.velocityX;
  this.y += this.velocityY;
}

Ball.prototype.render = function(ctx) {
  ctx.fillStyle = "red";
  ctx.fillRect(this.x, this.y, 2, 2);
}

var quadTree = new QuadTree(
  new Point(0, 0),
  new Point(width, height)
);
var balls = [];
var BALL_COUNT = 5000;
for (var i = 0; i < BALL_COUNT; i++) {
  var x = getRandomInt(0, width - 1);
  var y = getRandomInt(0, height - 1);
  var vX = getRandomInt(0, 1) == 0 ? 1 : -1;
  var vY = getRandomInt(0, 1) == 0 ? 1 : -1;

  var success = quadTree.insert(new Point(x, y));
  if (!success) {
    console.log("Failed to insert ball point ("+x+","+y+") into QuadTree");
  }

  balls.push( new Ball(x, y, vX, vY) );
}

var render = function() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  // Render frame
  for (var bIdx = 0; bIdx < balls.length; bIdx++) {
    balls[bIdx].render(ctx);
  }

  // Check for collisions
  for (var bIdx = 0; bIdx < balls.length; bIdx++) {
    for (var idx = 0; idx < balls.length; idx++) {
      if (bIdx != idx && balls[bIdx].collidesWith(balls[idx])) {
        balls[bIdx].reverseVelocity();
      }
    }

    if (balls[bIdx].x < 0 || balls[bIdx].x > width) {
      balls[bIdx].reflectX();
    }

    if (balls[bIdx].y < 0 || balls[bIdx].y > height) {
      balls[bIdx].reflectY();
    }
  }

  // Next frame
  for (var bIdx = 0; bIdx < balls.length; bIdx++) {
    balls[bIdx].update();

    // update point in quadTree
  }
}

setInterval(render, 15);
//render();
