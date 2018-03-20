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

  if (this.points.length < this.MAX_POINTS_PER_NODE && this.topLeftTree == null) {
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

QuadTree.prototype.findIndexOfPt = function(pt) {
  var foundIndex = -1;
  for (var ptIdx = 0; ptIdx < this.points.length; ptIdx++) {
    if (this.points[ptIdx].x == pt.x && this.points[ptIdx].y == pt.y) {
      foundIndex = ptIdx
    }
  }

  return foundIndex;
}

QuadTree.prototype.quadTreeForPt = function(pt) {
  if (!this.inBoundary(pt)) {
    return null;
  }

  // Is pt in current quadTree?
  var foundIndex = this.findIndexOfPt(pt);
  if (foundIndex !== -1) {
    return this;
  }

  if ((this.topLeftPt.x + this.bottomRightPt.x) / 2 >= pt.x) {
    if ((this.topLeftPt.y + this.bottomRightPt.y) / 2 >= pt.y) {
      // top left
      if (this.topLeftTree == null) {
        return null;
      }

      return this.topLeftTree.quadTreeForPt(pt);
    } else {
      // bottom left
      if (this.bottomLeftTree == null) {
        return null;
      }

      return this.bottomLeftTree.quadTreeForPt(pt);
    }
  } else {
    if ((this.topLeftPt.y + this.bottomRightPt.y) / 2 >= pt.y) {
      // top right
      if (this.topRightTree == null) {
        return null;
      }

      return this.topRightTree.quadTreeForPt(pt);
    } else {
      // bottom right
      if (this.bottomRightTree == null) {
        return null;
      }

      return this.bottomRightTree.quadTreeForPt(pt);
    }
  }

  return null;
}

// returns [Bool]. Returns true if successfully remove given pt from Quadtree. false otherwise
QuadTree.prototype.remove = function(pt) {
  var tree = this.quadTreeForPt(pt);

  if (tree === null) {
    return false;
  }

  // delete
  var ptIndex = this.findIndexOfPt(pt);
  if (ptIndex === -1) {
    return false;
  }

  this.points.splice(ptIndex, 1);
  return true;
}

QuadTree.prototype.neighbors = function(pt) {
  // Will return null if pt is not within bounds of current QuadTree
  var tree = this.quadTreeForPt(pt);

  if (tree == null) {
    return [];
  }

  var pts = tree.points;

  if (this.topLeftTree) {
    pts.concat( this.topLeftTree.neighbors(pt) );
  }

  if (this.topRightTree) {
    pts.concat( this.topRightTree.neighbors(pt) );
  }

  if (this.bottomLeftTree) {
    pts.concat( this.bottomLeftTree.neighbors(pt) );
  }

  if (this.bottomRightTree) {
    pts.concat( this.bottomRightTree.neighbors(pt) );
  }

  return pts;
}

QuadTree.prototype.inBoundary = function(pt) {
  return (pt.x > this.topLeftPt.x &&
    pt.x <= this.bottomRightPt.x &&
    pt.y >= this.topLeftPt.y &&
    pt.y <= this.bottomRightPt.y);
}
