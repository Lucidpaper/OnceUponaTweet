Meteor.startup(
  () => {
    if (Things.find().count() === 0) {
      Things.insert({
        title: "it's a thing!"
      })
    }
  }
);