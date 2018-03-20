var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var width = height = 800;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Ball = function(x, y, velocX, velocY) {
  this.pt = new Point(x, y);
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
  var diffX = Math.abs(this.pt.x - otherBall.pt.x);
  var diffY = Math.abs(this.pt.y - otherBall.pt.y);

  if (diffX <= 1 && diffY <= 1) {
    return true;
  }

  return false;
}

Ball.prototype.update = function() {
  this.pt.x += this.velocityX;
  this.pt.y += this.velocityY;
}

Ball.prototype.render = function(ctx) {
  ctx.fillStyle = "red";
  ctx.fillRect(this.pt.x, this.pt.y, 1, 1);
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
  /*  var neighborhood = quadTree.neighbors(new Point(balls[bIdx].x, balls[bIdx].y));
    if (neighborhood.length == 0) {
      neighborhood = balls;
    }*/

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
    oldPt = balls[bIdx].pt;
    balls[bIdx].update();

    // update point in quadTree
    quadTree.remove(oldPt);
    var success = quadTree.insert(balls[bIdx].pt);
    if (!success) {
      console.log("Failed to reinsert pt ("+balls[bIdx].pt.x+","+balls[bIdx].pt.y+")");
    }
  }
}

setInterval(render, 15);
//render();
