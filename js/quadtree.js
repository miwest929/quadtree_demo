var Point = function(x, y) {
  this.x = x;
  this.y = y;
}

var QuadTree = function(topLeftPt, bottomRightPt) {
  this.topLeftPt = topLeftPt;
  this.bottomRightPt = bottomRightPt;

  this.node = null;
  this.topLeftTree = null;
  this.topRightTree = null;
  this.bottomLeftTree = null;
  this.bottomRightTree = null;

  this.MAX_POINTS_PER_NODE = 4;
  this.points = [];
}

QuadTree.prototype.insert = function(pt) {
  // Current quad cannot contain it
  if (!this.inBoundary(pt)) {
    return false;
  }

  if (this.points.length < this.MAX_POINTS_PER_NODE) {
    this.points.push(pt);
    return true;
  }

  if (this.topLeftTree == null) {
    this.subdivide();
  }

  if (this.topLeftTree.insert(pt)) return true;
  if (this.topRightTree.insert(pt)) return true;
  if (this.bottomLeftTree.insert(pt)) return true;
  if (this.bottomRightTree.insert(pt)) return true;

  return false;
}

QuadTree.prototype.subdivide = function() {
  if (this.topLeftTree == null) {
    var newTopLeftPt = new Point(this.topLeftPt.x, this.topLeftPt.y);
    var newBottomRightPt = new Point(
      (this.topLeftPt.x + this.bottomRightPt.x) / 2,
      (this.topLeftPt.y + this.bottomRightPt.y) / 2,
    );
    this.topLeftTree = new QuadTree(newTopLeftPt, newBottomRightPt);
  }

  if (this.bottomLeftTree == null) {
    var newTopLeftPt = new Point(
      this.topLeftPt.x,
      (this.topLeftPt.y + this.bottomRightPt.y) / 2
    );
    var newBottomRightPt = new Point(
      (this.topLeftPt.x + this.bottomRightPt.x) / 2,
      this.bottomRightPt.y
    );
    this.bottomLeftTree = new QuadTree(newTopLeftPt, newBottomRightPt);
  }

  if (this.topRightTree == null) {
    var newTopLeftPt = new Point(
      (this.topLeftPt.x + this.bottomRightPt.x) / 2,
      this.topLeftPt.y
    );
    var newBottomRightPt = new Point(
      this.bottomRightPt.x,
      (this.topLeftPt.y + this.bottomRightPt.y) / 2
    );
    this.topRightTree = new QuadTree(newTopLeftPt, newBottomRightPt);
  }

  if (this.bottomRightTree == null) {
    var newTopLeftPt = new Point(
      (this.topLeftPt.x + this.bottomRightPt.x) / 2,
      (this.topLeftPt.y + this.bottomRightPt.y) / 2,
    );
    var newBottomRightPt = new Point(this.bottomRightPt.x, this.bottomRightPt.y);
    this.bottomRightTree = new QuadTree(newTopLeftPt, newBottomRightPt);
  }
}

QuadTree.prototype.inBoundary = function(pt) {
  return (pt.x > this.topLeftPt.x &&
    pt.x <= this.bottomRightPt.x &&
    pt.y >= this.topLeftPt.y &&
    pt.y <= this.bottomRightPt.y);
}
