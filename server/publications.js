Meteor.publish('Trends', () => {
  return Trends.find();
});

Meteor.publish('Stories', () => {
  return Stories.find();
});