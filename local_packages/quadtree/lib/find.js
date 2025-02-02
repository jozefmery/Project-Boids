"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _quad = _interopRequireDefault(require("./quad.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;
  if (node) quads.push(new _quad["default"](node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {
    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue;

    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;
      quads.push(new _quad["default"](node[3], xm, ym, x2, y2), new _quad["default"](node[2], x1, ym, xm, y2), new _quad["default"](node[1], xm, y1, x2, ym), new _quad["default"](node[0], x1, y1, xm, ym));

      if (i = (y >= ym) << 1 | x >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;

        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
  }

  return data;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maW5kLmpzIl0sIm5hbWVzIjpbIngiLCJ5IiwicmFkaXVzIiwiZGF0YSIsIngwIiwiX3gwIiwieTAiLCJfeTAiLCJ4MSIsInkxIiwieDIiLCJ5MiIsIngzIiwiX3gxIiwieTMiLCJfeTEiLCJxdWFkcyIsIm5vZGUiLCJfcm9vdCIsInEiLCJpIiwicHVzaCIsIlF1YWQiLCJJbmZpbml0eSIsInBvcCIsImxlbmd0aCIsInhtIiwieW0iLCJkeCIsIl94IiwiY2FsbCIsImR5IiwiX3kiLCJkMiIsImQiLCJNYXRoIiwic3FydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRWUsa0JBQVNBLENBQVQsRUFBWUMsQ0FBWixFQUFlQyxNQUFmLEVBQXVCO0FBQ3BDLE1BQUlDLElBQUo7QUFBQSxNQUNJQyxFQUFFLEdBQUcsS0FBS0MsR0FEZDtBQUFBLE1BRUlDLEVBQUUsR0FBRyxLQUFLQyxHQUZkO0FBQUEsTUFHSUMsRUFISjtBQUFBLE1BSUlDLEVBSko7QUFBQSxNQUtJQyxFQUxKO0FBQUEsTUFNSUMsRUFOSjtBQUFBLE1BT0lDLEVBQUUsR0FBRyxLQUFLQyxHQVBkO0FBQUEsTUFRSUMsRUFBRSxHQUFHLEtBQUtDLEdBUmQ7QUFBQSxNQVNJQyxLQUFLLEdBQUcsRUFUWjtBQUFBLE1BVUlDLElBQUksR0FBRyxLQUFLQyxLQVZoQjtBQUFBLE1BV0lDLENBWEo7QUFBQSxNQVlJQyxDQVpKO0FBY0EsTUFBSUgsSUFBSixFQUFVRCxLQUFLLENBQUNLLElBQU4sQ0FBVyxJQUFJQyxnQkFBSixDQUFTTCxJQUFULEVBQWViLEVBQWYsRUFBbUJFLEVBQW5CLEVBQXVCTSxFQUF2QixFQUEyQkUsRUFBM0IsQ0FBWDtBQUNWLE1BQUlaLE1BQU0sSUFBSSxJQUFkLEVBQW9CQSxNQUFNLEdBQUdxQixRQUFULENBQXBCLEtBQ0s7QUFDSG5CLElBQUFBLEVBQUUsR0FBR0osQ0FBQyxHQUFHRSxNQUFULEVBQWlCSSxFQUFFLEdBQUdMLENBQUMsR0FBR0MsTUFBMUI7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Q0FBckI7QUFDQXRCLFVBQUFBLEVBQUUsR0FBR1osQ0FBQyxHQUFHa0MsQ0FBVCxFQUFZcEIsRUFBRSxHQUFHYixDQUFDLEdBQUdpQyxDQUFyQjtBQUNBL0IsVUFBQUEsSUFBSSxHQUFHYyxJQUFJLENBQUNkLElBQVo7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsU0FBT0EsSUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1YWQgZnJvbSBcIi4vcXVhZC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCB5LCByYWRpdXMpIHtcbiAgdmFyIGRhdGEsXG4gICAgICB4MCA9IHRoaXMuX3gwLFxuICAgICAgeTAgPSB0aGlzLl95MCxcbiAgICAgIHgxLFxuICAgICAgeTEsXG4gICAgICB4MixcbiAgICAgIHkyLFxuICAgICAgeDMgPSB0aGlzLl94MSxcbiAgICAgIHkzID0gdGhpcy5feTEsXG4gICAgICBxdWFkcyA9IFtdLFxuICAgICAgbm9kZSA9IHRoaXMuX3Jvb3QsXG4gICAgICBxLFxuICAgICAgaTtcblxuICBpZiAobm9kZSkgcXVhZHMucHVzaChuZXcgUXVhZChub2RlLCB4MCwgeTAsIHgzLCB5MykpO1xuICBpZiAocmFkaXVzID09IG51bGwpIHJhZGl1cyA9IEluZmluaXR5O1xuICBlbHNlIHtcbiAgICB4MCA9IHggLSByYWRpdXMsIHkwID0geSAtIHJhZGl1cztcbiAgICB4MyA9IHggKyByYWRpdXMsIHkzID0geSArIHJhZGl1cztcbiAgICByYWRpdXMgKj0gcmFkaXVzO1xuICB9XG5cbiAgd2hpbGUgKHEgPSBxdWFkcy5wb3AoKSkge1xuXG4gICAgLy8gU3RvcCBzZWFyY2hpbmcgaWYgdGhpcyBxdWFkcmFudCBjYW7igJl0IGNvbnRhaW4gYSBjbG9zZXIgbm9kZS5cbiAgICBpZiAoIShub2RlID0gcS5ub2RlKVxuICAgICAgICB8fCAoeDEgPSBxLngwKSA+IHgzXG4gICAgICAgIHx8ICh5MSA9IHEueTApID4geTNcbiAgICAgICAgfHwgKHgyID0gcS54MSkgPCB4MFxuICAgICAgICB8fCAoeTIgPSBxLnkxKSA8IHkwKSBjb250aW51ZTtcblxuICAgIC8vIEJpc2VjdCB0aGUgY3VycmVudCBxdWFkcmFudC5cbiAgICBpZiAobm9kZS5sZW5ndGgpIHtcbiAgICAgIHZhciB4bSA9ICh4MSArIHgyKSAvIDIsXG4gICAgICAgICAgeW0gPSAoeTEgKyB5MikgLyAyO1xuXG4gICAgICBxdWFkcy5wdXNoKFxuICAgICAgICBuZXcgUXVhZChub2RlWzNdLCB4bSwgeW0sIHgyLCB5MiksXG4gICAgICAgIG5ldyBRdWFkKG5vZGVbMl0sIHgxLCB5bSwgeG0sIHkyKSxcbiAgICAgICAgbmV3IFF1YWQobm9kZVsxXSwgeG0sIHkxLCB4MiwgeW0pLFxuICAgICAgICBuZXcgUXVhZChub2RlWzBdLCB4MSwgeTEsIHhtLCB5bSlcbiAgICAgICk7XG5cbiAgICAgIC8vIFZpc2l0IHRoZSBjbG9zZXN0IHF1YWRyYW50IGZpcnN0LlxuICAgICAgaWYgKGkgPSAoeSA+PSB5bSkgPDwgMSB8ICh4ID49IHhtKSkge1xuICAgICAgICBxID0gcXVhZHNbcXVhZHMubGVuZ3RoIC0gMV07XG4gICAgICAgIHF1YWRzW3F1YWRzLmxlbmd0aCAtIDFdID0gcXVhZHNbcXVhZHMubGVuZ3RoIC0gMSAtIGldO1xuICAgICAgICBxdWFkc1txdWFkcy5sZW5ndGggLSAxIC0gaV0gPSBxO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IHRoaXMgcG9pbnQuIChWaXNpdGluZyBjb2luY2lkZW50IHBvaW50cyBpc27igJl0IG5lY2Vzc2FyeSEpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgZHggPSB4IC0gK3RoaXMuX3guY2FsbChudWxsLCBub2RlLmRhdGEpLFxuICAgICAgICAgIGR5ID0geSAtICt0aGlzLl95LmNhbGwobnVsbCwgbm9kZS5kYXRhKSxcbiAgICAgICAgICBkMiA9IGR4ICogZHggKyBkeSAqIGR5O1xuICAgICAgaWYgKGQyIDwgcmFkaXVzKSB7XG4gICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHJhZGl1cyA9IGQyKTtcbiAgICAgICAgeDAgPSB4IC0gZCwgeTAgPSB5IC0gZDtcbiAgICAgICAgeDMgPSB4ICsgZCwgeTMgPSB5ICsgZDtcbiAgICAgICAgZGF0YSA9IG5vZGUuZGF0YTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cbiJdfQ==