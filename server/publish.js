Meteor.publish('fiddle', function (id) {
  return Fiddle.find({ _id: id });
});
