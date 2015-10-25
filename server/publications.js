Meteor.publish('Things', () => {
  return Things.find();
});
