"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = quadtree;

var _add = _interopRequireWildcard(require("./add.js"));

var _cover = _interopRequireDefault(require("./cover.js"));

var _data = _interopRequireDefault(require("./data.js"));

var _extent = _interopRequireDefault(require("./extent.js"));

var _find = _interopRequireDefault(require("./find.js"));

var _findAll = _interopRequireDefault(require("./findAll"));

var _remove = _interopRequireWildcard(require("./remove.js"));

var _root = _interopRequireDefault(require("./root.js"));

var _size = _interopRequireDefault(require("./size.js"));

var _visit = _interopRequireDefault(require("./visit.js"));

var _visitAfter = _interopRequireDefault(require("./visitAfter.js"));

var _x = _interopRequireWildcard(require("./x.js"));

var _y = _interopRequireWildcard(require("./y.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? _x.defaultX : x, y == null ? _y.defaultY : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy(leaf) {
  var copy = {
    data: leaf.data
  },
      next = copy;

  while (leaf = leaf.next) {
    next = next.next = {
      data: leaf.data
    };
  }

  return copy;
}

var treeProto = quadtree.prototype = Quadtree.prototype;

treeProto.copy = function () {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;
  if (!node) return copy;
  if (!node.length) return copy._root = leaf_copy(node), copy;
  nodes = [{
    source: node,
    target: copy._root = new Array(4)
  }];

  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({
          source: child,
          target: node.target[i] = new Array(4)
        });else node.target[i] = leaf_copy(child);
      }
    }
  }

  return copy;
};

treeProto.add = _add["default"];
treeProto.addAll = _add.addAll;
treeProto.cover = _cover["default"];
treeProto.data = _data["default"];
treeProto.extent = _extent["default"];
treeProto.find = _find["default"];
treeProto.findAll = _findAll["default"];
treeProto.remove = _remove["default"];
treeProto.removeAll = _remove.removeAll;
treeProto.root = _root["default"];
treeProto.size = _size["default"];
treeProto.visit = _visit["default"];
treeProto.visitAfter = _visitAfter["default"];
treeProto.x = _x["default"];
treeProto.y = _y["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWFkdHJlZS5qcyJdLCJuYW1lcyI6WyJxdWFkdHJlZSIsIm5vZGVzIiwieCIsInkiLCJ0cmVlIiwiUXVhZHRyZWUiLCJkZWZhdWx0WCIsImRlZmF1bHRZIiwiTmFOIiwiYWRkQWxsIiwieDAiLCJ5MCIsIngxIiwieTEiLCJfeCIsIl95IiwiX3gwIiwiX3kwIiwiX3gxIiwiX3kxIiwiX3Jvb3QiLCJ1bmRlZmluZWQiLCJsZWFmX2NvcHkiLCJsZWFmIiwiY29weSIsImRhdGEiLCJuZXh0IiwidHJlZVByb3RvIiwicHJvdG90eXBlIiwibm9kZSIsImNoaWxkIiwibGVuZ3RoIiwic291cmNlIiwidGFyZ2V0IiwiQXJyYXkiLCJwb3AiLCJpIiwicHVzaCIsImFkZCIsInRyZWVfYWRkIiwidHJlZV9hZGRBbGwiLCJjb3ZlciIsInRyZWVfY292ZXIiLCJ0cmVlX2RhdGEiLCJleHRlbnQiLCJ0cmVlX2V4dGVudCIsImZpbmQiLCJ0cmVlX2ZpbmQiLCJmaW5kQWxsIiwidHJlZV9maW5kQWxsIiwicmVtb3ZlIiwidHJlZV9yZW1vdmUiLCJyZW1vdmVBbGwiLCJ0cmVlX3JlbW92ZUFsbCIsInJvb3QiLCJ0cmVlX3Jvb3QiLCJzaXplIiwidHJlZV9zaXplIiwidmlzaXQiLCJ0cmVlX3Zpc2l0IiwidmlzaXRBZnRlciIsInRyZWVfdmlzaXRBZnRlciIsInRyZWVfeCIsInRyZWVfeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsU0FBU0EsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUJDLENBQXpCLEVBQTRCQyxDQUE1QixFQUErQjtBQUM1QyxNQUFJQyxJQUFJLEdBQUcsSUFBSUMsUUFBSixDQUFhSCxDQUFDLElBQUksSUFBTCxHQUFZSSxXQUFaLEdBQXVCSixDQUFwQyxFQUF1Q0MsQ0FBQyxJQUFJLElBQUws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T04sSUFBUDtBQUNELENBckJEOztBQXVCQUcsU0FBUyxDQUFDVyxHQUFWLEdBQWdCQyxlQUFoQjtBQUNBWixTQUFTLENBQUNsQixNQUFWLEdBQW1CK0IsV0FBbkI7QUFDQWIsU0FBUyxDQUFDYyxLQUFWLEdBQWtCQyxpQkFBbEI7QUFDQWYsU0FBUyxDQUFDRixJQUFWLEdBQWlCa0IsZ0JBQWpCO0FBQ0FoQixTQUFTLENBQUNpQixNQUFWLEdBQW1CQyxrQkFBbkI7QUFDQWxCLFNBQVMsQ0FBQ21CLElBQVYsR0FBaUJDLGdCQUFqQjtBQUNBcEIsU0FBUyxDQUFDcUIsT0FBVixHQUFvQkMsbUJBQXBCO0FBQ0F0QixTQUFTLENBQUN1QixNQUFWLEdBQW1CQyxrQkFBbkI7QUFDQXhCLFNBQVMsQ0FBQ3lCLFNBQVYsR0FBc0JDLGlCQUF0QjtBQUNBMUIsU0FBUyxDQUFDMkIsSUFBVixHQUFpQkMsZ0JBQWpCO0FBQ0E1QixTQUFTLENBQUM2QixJQUFWLEdBQWlCQyxnQkFBakI7QUFDQTlCLFNBQVMsQ0FBQytCLEtBQVYsR0FBa0JDLGlCQUFsQjtBQUNBaEMsU0FBUyxDQUFDaUMsVUFBVixHQUF1QkMsc0JBQXZCO0FBQ0FsQyxTQUFTLENBQUN6QixDQUFWLEdBQWM0RCxhQUFkO0FBQ0FuQyxTQUFTLENBQUN4QixDQUFWLEdBQWM0RCxhQUFkIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRyZWVfYWRkLCB7YWRkQWxsIGFzIHRyZWVfYWRkQWxsfSBmcm9tIFwiLi9hZGQuanNcIjtcbmltcG9ydCB0cmVlX2NvdmVyIGZyb20gXCIuL2NvdmVyLmpzXCI7XG5pbXBvcnQgdHJlZV9kYXRhIGZyb20gXCIuL2RhdGEuanNcIjtcbmltcG9ydCB0cmVlX2V4dGVudCBmcm9tIFwiLi9leHRlbnQuanNcIjtcbmltcG9ydCB0cmVlX2ZpbmQgZnJvbSBcIi4vZmluZC5qc1wiO1xuaW1wb3J0IHRyZWVfZmluZEFsbCBmcm9tIFwiLi9maW5kQWxsXCI7XG5pbXBvcnQgdHJlZV9yZW1vdmUsIHtyZW1vdmVBbGwgYXMgdHJlZV9yZW1vdmVBbGx9IGZyb20gXCIuL3JlbW92ZS5qc1wiO1xuaW1wb3J0IHRyZWVfcm9vdCBmcm9tIFwiLi9yb290LmpzXCI7XG5pbXBvcnQgdHJlZV9zaXplIGZyb20gXCIuL3NpemUuanNcIjtcbmltcG9ydCB0cmVlX3Zpc2l0IGZyb20gXCIuL3Zpc2l0LmpzXCI7XG5pbXBvcnQgdHJlZV92aXNpdEFmdGVyIGZyb20gXCIuL3Zpc2l0QWZ0ZXIuanNcIjtcbmltcG9ydCB0cmVlX3gsIHtkZWZhdWx0WH0gZnJvbSBcIi4veC5qc1wiO1xuaW1wb3J0IHRyZWVfeSwge2RlZmF1bHRZfSBmcm9tIFwiLi95LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHF1YWR0cmVlKG5vZGVzLCB4LCB5KSB7XG4gIHZhciB0cmVlID0gbmV3IFF1YWR0cmVlKHggPT0gbnVsbCA/IGRlZmF1bHRYIDogeCwgeSA9PSBudWxsID8gZGVmYXVsdFkgOiB5LCBOYU4sIE5hTiwgTmFOLCBOYU4pO1xuICByZXR1cm4gbm9kZXMgPT0gbnVsbCA/IHRyZWUgOiB0cmVlLmFkZEFsbChub2Rlcyk7XG59XG5cbmZ1bmN0aW9uIFF1YWR0cmVlKHgsIHksIHgwLCB5MCwgeDEsIHkxKSB7XG4gIHRoaXMuX3ggPSB4O1xuICB0aGlzLl95ID0geTtcbiAgdGhpcy5feDAgPSB4MDtcbiAgdGhpcy5feTAgPSB5MDtcbiAgdGhpcy5feDEgPSB4MTtcbiAgdGhpcy5feTEgPSB5MTtcbiAgdGhpcy5fcm9vdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbGVhZl9jb3B5KGxlYWYpIHtcbiAgdmFyIGNvcHkgPSB7ZGF0YTogbGVhZi5kYXRhfSwgbmV4dCA9IGNvcHk7XG4gIHdoaWxlIChsZWFmID0gbGVhZi5uZXh0KSBuZXh0ID0gbmV4dC5uZXh0ID0ge2RhdGE6IGxlYWYuZGF0YX07XG4gIHJldHVybiBjb3B5O1xufVxuXG52YXIgdHJlZVByb3RvID0gcXVhZHRyZWUucHJvdG90eXBlID0gUXVhZHRyZWUucHJvdG90eXBlO1xuXG50cmVlUHJvdG8uY29weSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29weSA9IG5ldyBRdWFkdHJlZSh0aGlzLl94LCB0aGlzLl95LCB0aGlzLl94MCwgdGhpcy5feTAsIHRoaXMuX3gxLCB0aGlzLl95MSksXG4gICAgICBub2RlID0gdGhpcy5fcm9vdCxcbiAgICAgIG5vZGVzLFxuICAgICAgY2hpbGQ7XG5cbiAgaWYgKCFub2RlKSByZXR1cm4gY29weTtcblxuICBpZiAoIW5vZGUubGVuZ3RoKSByZXR1cm4gY29weS5fcm9vdCA9IGxlYWZfY29weShub2RlKSwgY29weTtcblxuICBub2RlcyA9IFt7c291cmNlOiBub2RlLCB0YXJnZXQ6IGNvcHkuX3Jvb3QgPSBuZXcgQXJyYXkoNCl9XTtcbiAgd2hpbGUgKG5vZGUgPSBub2Rlcy5wb3AoKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlLnNvdXJjZVtpXSkge1xuICAgICAgICBpZiAoY2hpbGQubGVuZ3RoKSBub2Rlcy5wdXNoKHtzb3VyY2U6IGNoaWxkLCB0YXJnZXQ6IG5vZGUudGFyZ2V0W2ldID0gbmV3IEFycmF5KDQpfSk7XG4gICAgICAgIGVsc2Ugbm9kZS50YXJnZXRbaV0gPSBsZWFmX2NvcHkoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3B5O1xufTtcblxudHJlZVByb3RvLmFkZCA9IHRyZWVfYWRkO1xudHJlZVByb3RvLmFkZEFsbCA9IHRyZWVfYWRkQWxsO1xudHJlZVByb3RvLmNvdmVyID0gdHJlZV9jb3ZlcjtcbnRyZWVQcm90by5kYXRhID0gdHJlZV9kYXRhO1xudHJlZVByb3RvLmV4dGVudCA9IHRyZWVfZXh0ZW50O1xudHJlZVByb3RvLmZpbmQgPSB0cmVlX2ZpbmQ7XG50cmVlUHJvdG8uZmluZEFsbCA9IHRyZWVfZmluZEFsbDtcbnRyZWVQcm90by5yZW1vdmUgPSB0cmVlX3JlbW92ZTtcbnRyZWVQcm90by5yZW1vdmVBbGwgPSB0cmVlX3JlbW92ZUFsbDtcbnRyZWVQcm90by5yb290ID0gdHJlZV9yb290O1xudHJlZVByb3RvLnNpemUgPSB0cmVlX3NpemU7XG50cmVlUHJvdG8udmlzaXQgPSB0cmVlX3Zpc2l0O1xudHJlZVByb3RvLnZpc2l0QWZ0ZXIgPSB0cmVlX3Zpc2l0QWZ0ZXI7XG50cmVlUHJvdG8ueCA9IHRyZWVfeDtcbnRyZWVQcm90by55ID0gdHJlZV95O1xuIl19