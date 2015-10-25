Meteor.publish('Trends', () => {
  return Trends.find();
});
