"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _quad = _interopRequireDefault(require("./quad.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(callback) {
  var quads = [],
      next = [],
      q;
  if (this._root) quads.push(new _quad["default"](this._root, this._x0, this._y0, this._x1, this._y1));

  while (q = quads.pop()) {
    var node = q.node;

    if (node.length) {
      var child,
          x0 = q.x0,
          y0 = q.y0,
          x1 = q.x1,
          y1 = q.y1,
          xm = (x0 + x1) / 2,
          ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new _quad["default"](child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new _quad["default"](child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new _quad["default"](child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new _quad["default"](child, xm, ym, x1, y1));
    }

    next.push(q);
  }

  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }

  return this;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy92aXNpdEFmdGVyLmpzIl0sIm5hbWVzIjpbImNhbGxiYWNrIiwicXVhZHMiLCJuZXh0IiwicSIsIl9yb290IiwicHVzaCIsIlF1YWQiLCJfeDAiLCJfeTAiLCJfeDEiLCJfeTEiLCJwb3AiLCJub2RlIiwibGVuZ3RoIiwiY2hpbGQiLCJ4MCIsInkwIiwieDEiLCJ5MSIsInhtIiwieW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVlLGtCQUFTQSxRQUFULEVBQW1CO0FBQ2hDLE1BQUlDLEtBQUssR0FBRyxFQUFaO0FBQUEsTUFBZ0JDLElBQUksR0FBRyxFQUF2QjtBQUFBLE1BQTJCQyxDQUEzQjtBQUNBLE1BQUksS0FBS0MsS0FBVCxFQUFnQkgsS0FBSyxDQUFDSSxJQUFOLENBQVcsSUFBSUMsZ0JBQUosQ0FBUyxLQUFLRixLQUFkLEVBQXFCLEtBQUtHLEdBQTFCLEVBQStCLEtBQUtDLEdBQXBDLEVBQXlDLEtBQUtDLEdBQTlDLEVBQW1ELEtBQUtDLEdBQXhELENBQVg7O0FBQ2hCLFNBQU9QLENBQUMsR0FBR0YsS0FBSyxDQUFDVSxHQUFOLEVBQVgsRUFBd0I7QUFDdEIsUUFBSUMsSUFBSSxHQUFHVCxDQUFDLENBQUNTLElBQWI7O0FBQ0EsUUFBSUEsSUFBSSxDQUFDQyxNQUFULEVBQWlCO0FBQ2YsVUFBSUMsS0FBSjtBQUFBLFVBQVdDLEVBQUUsR0FBR1osQ0FBQyxDQUFDWSxFQUFsQjtBQUFBLFVBQXNCQyxFQUFFLEdBQUdiLENBQUMsQ0FBQ2EsRUFBN0I7QUFBQSxVQUFpQ0MsRUFBRSxHQUFHZCxDQUFDLENBQUNjLEVBQXhDO0FBQUEsVUFBNENDLEVBQUUsR0FBR2YsQ0FBQyxDQUFDZSxFQUFuRDtBQUFBLFVBQXVEQyxFQUFFLEdBQUcsQ0FBQ0osRUFBRSxHQUFHRSxFQUFOLElBQVksQ0FBeEU7QUFBQSxVQUEyRUcsRUFBRSxHQUFHLENBQUNKLEVBQUUsR0FBR0UsRUFBTixJQUFZLENBQTVGO0FBQ0EsVUFBSUosS0FBSyxHQUFHRixJQUFJLENBQUMsQ0FBRCxDQUFoQixFQUFxQlgsS0FBSyxDQUFDSSxJQUFOLENBQVcsSUFBSUMsZ0JBQUosQ0FBU1EsS0FBVCxFQUFnQkMsRUFBaEIsRUFBb0JDLEVBQXBCLEVBQXdCRyxFQUF4QixFQUE0QkMsRUFBNUIsQ0FBWDtBQUNyQixVQUFJTixLQUFLLEdBQUdGLElBQUksQ0FBQyxDQUFELENBQWhCLEVBQXFCWCxLQUFLLENBQUNJLElBQU4sQ0FBVyxJQUFJQyxnQkFBSixDQUFTUSxLQUFULEVBQWdCSyxFQUFoQixFQUFvQkgsRUFBcEIsRUFBd0JDLEVBQXhCLEVBQTRCRyxFQUE1QixDQUFYO0FBQ3JCLFVBQUlOLEtBQUssR0FBR0YsSUFBSSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJYLEtBQUssQ0FBQ0ksSUFBTixDQUFXLElBQUlDLGdCQUFKLENBQVNRLEtBQVQsRUFBZ0JDLEVBQWhCLEVBQW9CSyxFQUFwQixFQUF3QkQsRUFBeEIsRUFBNEJELEVBQTVCLENBQVg7QUFDckIsVUFBSUosS0FBSyxHQUFHRixJQUFJLENBQUMsQ0FBRCxDQUFoQixFQUFxQlgsS0FBSyxDQUFDSSxJQUFOLENBQVcsSUFBSUMsZ0JBQUosQ0FBU1EsS0FBVCxFQUFnQkssRUFBaEIsRUFBb0JDLEVBQXBCLEVBQXdCSCxFQUF4QixFQUE0QkMsRUFBNUIsQ0FBWDtBQUN0Qjs7QUFDRGhCLElBQUFBLElBQUksQ0FBQ0csSUFBTCxDQUFVRixDQUFWO0FBQ0Q7O0FBQ0QsU0FBT0EsQ0FBQyxHQUFHRCxJQUFJLENBQUNTLEdBQUwsRUFBWCxFQUF1QjtBQUNyQlgsSUFBQUEsUUFBUSxDQUFDRyxDQUFDLENBQUNTLElBQUgsRUFBU1QsQ0FBQyxDQUFDWSxFQUFYLEVBQWVaLENBQUMsQ0FBQ2EsRUFBakIsRUFBcUJiLENBQUMsQ0FBQ2MsRUFBdkIsRUFBMkJkLENBQUMsQ0FBQ2UsRUFBN0IsQ0FBUjtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1YWQgZnJvbSBcIi4vcXVhZC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgcXVhZHMgPSBbXSwgbmV4dCA9IFtdLCBxO1xuICBpZiAodGhpcy5fcm9vdCkgcXVhZHMucHVzaChuZXcgUXVhZCh0aGlzLl9yb290LCB0aGlzLl94MCwgdGhpcy5feTAsIHRoaXMuX3gxLCB0aGlzLl95MSkpO1xuICB3aGlsZSAocSA9IHF1YWRzLnBvcCgpKSB7XG4gICAgdmFyIG5vZGUgPSBxLm5vZGU7XG4gICAgaWYgKG5vZGUubGVuZ3RoKSB7XG4gICAgICB2YXIgY2hpbGQsIHgwID0gcS54MCwgeTAgPSBxLnkwLCB4MSA9IHEueDEsIHkxID0gcS55MSwgeG0gPSAoeDAgKyB4MSkgLyAyLCB5bSA9ICh5MCArIHkxKSAvIDI7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzBdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4MCwgeTAsIHhtLCB5bSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVsxXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeG0sIHkwLCB4MSwgeW0pKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMl0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHgwLCB5bSwgeG0sIHkxKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzNdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4bSwgeW0sIHgxLCB5MSkpO1xuICAgIH1cbiAgICBuZXh0LnB1c2gocSk7XG4gIH1cbiAgd2hpbGUgKHEgPSBuZXh0LnBvcCgpKSB7XG4gICAgY2FsbGJhY2socS5ub2RlLCBxLngwLCBxLnkwLCBxLngxLCBxLnkxKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbiJdfQ==