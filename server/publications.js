Meteor.publish('Trends', () => {
  return Trends.find();
});

Meteor.publish('Stories', () => {
  return Trends.find();
});