let tweetJobs = JobCollection(
  'tweetJobsCollection',
  // remove the ".jobs" suffix from the collection name
  {'noCollectionSuffix': true}
);

// on startup, remove all old email jobs (jc.forever causes repeating
// jobs to remain after server restart)
Meteor.startup(function () {
  tweetJobs.remove({type: 'tweetJob'});
  createTweetJob();
});

// create a queueCharges job at a set interval, which repeats infinitely
let createTweetJob = function () {
  new Job(tweetJobs, 'tweetJob', {})
    .priority('normal')
    .retry({
      retries: 5,                         // If fail, retry 5 times
      wait: 5 * 1000                     // half a minute between attempts
    })
    .repeat({
      //repeats: tweetJobs.forever,  // repeats forever
      //wait: 60 * 60 * 1000                // hour between repeats
      wait: 5 * 1000
    })
    .save();                               // Submit job to the queue
};


tweetJobs.processJobs(
  "tweetJob",
  // options for job processing behavior
  {
    concurrency: 1,      //max number of simultaneous outstanding async calls to worker allowed
    payload: 1,             //max number of job objects to provide to each worker
    pollInterval: 5 * 1000,   //how often to check the collection for more
    // jobs (ms)
    prefetch: 0           //how many extra jobs to request to compensate for latency
  },
  function (job, cb) {
      console.log("job running!")
    try {
      //T.post('statuses/update', {status: 'hello world!'}, function (err, data, response) {
      //  console.log(data)
      //})

      T.get('trends/place', {
        id: 23424977
      }, (err, data, response) => {
        logEach(data[0].trends);


        //let boundInsert = Meteor.bindEnvironment(tweet => {
        //  //Tweets.insert({
        //  //  "user_name": tweet.user.name,
        //  //  "screen_name": tweet.user.screen_name,
        //  //  "text": tweet.text
        //  //})
        //  Things.insert({tweet});
        //}, 'Failed to insert tweet into Posts collection.');
        //
        //R.forEach(boundInsert, data)
      });

      job.done(
        console.log("tweet job ran")
        //bind the asynchronous callback
        //Meteor.bindEnvironment(function (err, res) {
        //  if (!err) {
        //    job.remove();
        //  }
        //})
      );
    } catch (e) {
      job.fail('tweet job failed');
    }
    finally {
      cb();
    }
  }
);

tweetJobs.startJobServer();