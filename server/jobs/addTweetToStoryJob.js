let getTopTweetJobs = JobCollection(
  'getTopTweetJobsCollection',
  // remove the ".jobs" suffix from the collection name
  {'noCollectionSuffix': true}
);

// on startup, remove all old email jobs (jc.forever causes repeating
// jobs to remain after server restart)
Meteor.startup(function () {
  getTopTweetJobs.remove({type: 'getTopTweet'});
  createGetTopTweetJob();
});

// create a queueCharges job at a set interval, which repeats infinitely
let createGetTopTweetJob = function () {
  new Job(getTopTweetJobs, 'getTopTweetJob', {})
    .priority('normal')
    .retry({
      retries: 5,                         // If fail, retry 5 times
      wait: 30 * 1000                     // half a minute between attempts
    })
    .repeat({
      repeats: getTopTweetJobs.forever,  // repeats forever
      //wait: 60 * 60 * 1000                // day between repeats
      wait: 1000
    })
    .save();                               // Submit job to the queue
};


let boundInsert = Meteor.bindEnvironment(a => {
  let id = Stories.findOne()._id
  Stories.update(
    {_id: id},
    {$push: {story: a}}
  )
}, 'Failed to insert tweet into Posts collection.');

getTopTweetJobs.processJobs(
  "getTopTweetJob",
  // options for job processing behavior
  {
    concurrency: 1,      //max number of simultaneous outstanding async calls to worker allowed
    payload: 1,             //max number of job objects to provide to each worker
    pollInterval: 1000,   //how often to check the collection for more
    // jobs (ms)
    prefetch: 0           //how many extra jobs to request to compensate for latency
  },
  function (job, cb) {
    console.log("job running!")

    try {
      T.get('search/tweets', {
        q: 'banana',
        count: 3
      }, (err, data, response) => {
        //console.log(err)
        //console.log(data)
        //console.log(response)

        console.log(data.statuses[0].text)
        //console.log(data.statuses[0].created_at)

        let tweet = data.statuses[0]
        R.forEach(
          (status) => {
            if (status.retweet_count > tweet.retweet_count){
              tweet = status
            }
          },
          data.statuses
        );
        boundInsert(tweet)

        //T.post('statuses/update', {status: starterTweet}, function (err, data, response) {
        //  //console.log(err)
        //  console.log(data)
        //  //console.log(response)
        //})
      });

      job.done(
        console.log("tweet job done")
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

getTopTweetJobs.startJobServer();