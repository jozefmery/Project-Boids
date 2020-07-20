"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  var size = 0;
  this.visit(function (node) {
    if (!node.length) do {
      ++size;
    } while (node = node.next);
  });
  return size;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaXplLmpzIl0sIm5hbWVzIjpbInNpemUiLCJ2aXNpdCIsIm5vZGUiLCJsZW5ndGgiLCJuZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQWUsb0JBQVc7QUFDeEIsTUFBSUEsSUFBSSxHQUFHLENBQVg7QUFDQSxPQUFLQyxLQUFMLENBQVcsVUFBU0MsSUFBVCxFQUFlO0FBQ3hCLFFBQUksQ0FBQ0EsSUFBSSxDQUFDQyxNQUFWLEVBQWtCO0FBQUcsUUFBRUgsSUFBRjtBQUFILGFBQWtCRSxJQUFJLEdBQUdBLElBQUksQ0FBQ0UsSUFBOUI7QUFDbkIsR0FGRDtBQUdBLFNBQU9KLElBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIHRoaXMudmlzaXQoZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZS5sZW5ndGgpIGRvICsrc2l6ZTsgd2hpbGUgKG5vZGUgPSBub2RlLm5leHQpXG4gIH0pO1xuICByZXR1cm4gc2l6ZTtcbn1cbiJdfQ==