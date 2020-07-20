"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  var data = [];
  this.visit(function (node) {
    if (!node.length) do {
      data.push(node.data);
    } while (node = node.next);
  });
  return data;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLmpzIl0sIm5hbWVzIjpbImRhdGEiLCJ2aXNpdCIsIm5vZGUiLCJsZW5ndGgiLCJwdXNoIiwibmV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFlLG9CQUFXO0FBQ3hCLE1BQUlBLElBQUksR0FBRyxFQUFYO0FBQ0EsT0FBS0MsS0FBTCxDQUFXLFVBQVNDLElBQVQsRUFBZTtBQUN4QixRQUFJLENBQUNBLElBQUksQ0FBQ0MsTUFBVixFQUFrQjtBQUFHSCxNQUFBQSxJQUFJLENBQUNJLElBQUwsQ0FBVUYsSUFBSSxDQUFDRixJQUFmO0FBQUgsYUFBZ0NFLElBQUksR0FBR0EsSUFBSSxDQUFDRyxJQUE1QztBQUNuQixHQUZEO0FBR0EsU0FBT0wsSUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0gW107XG4gIHRoaXMudmlzaXQoZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZS5sZW5ndGgpIGRvIGRhdGEucHVzaChub2RlLmRhdGEpOyB3aGlsZSAobm9kZSA9IG5vZGUubmV4dClcbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufVxuIl19