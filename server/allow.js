Fiddle.allow({ // Anyone can create new one, they are immutable
  insert: function () {
    return true;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});
