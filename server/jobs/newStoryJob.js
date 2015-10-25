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
      wait: 1000                     // half a minute between attempts
    })
    .repeat({
      //repeats: tweetJobs.forever,  // repeats forever
      //wait: 60 * 60 * 1000                // hour between repeats
      wait: 1000
    })
    .save();                               // Submit job to the queue
};


let boundInsert = Meteor.bindEnvironment(tweet => {
  //Tweets.insert({
  //  "user_name": tweet.user.name,
  //  "screen_name": tweet.user.screen_name,
  //  "text": tweet.text
  //})
  Things.insert({tweet});
}, 'Failed to insert tweet into Posts collection.');

tweetJobs.processJobs(
  "tweetJob",
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
      T.get('trends/place', {
        id: 23424977
      }, (err, data, response) => {
        //console.log(data)
        console.log(err)
        //console.log(response)

        //let trends = data[0].trends
        //logEach(trends);
        let trends = [
          {
            name: 'Flip Saunders',
            query: '%22Flip+Saunders%22',
            url: 'http://twitter.com/search?q=%22Flip+Saunders%22',
            promoted_content: null
          },
          {
            name: 'Texans',
            query: 'Texans',
            url: 'http://twitter.com/search?q=Texans',
            promoted_content: null
          },
          {
            name: 'Andrew Luck',
            query: '%22Andrew+Luck%22',
            url: 'http://twitter.com/search?q=%22Andrew+Luck%22',
            promoted_content: null
          },
          {
            name: 'Jets',
            query: 'Jets',
            url: 'http://twitter.com/search?q=Jets',
            promoted_content: null
          },
          {
            name: '#BlueNeighbourhood',
            query: '%23BlueNeighbourhood',
            url: 'http://twitter.com/search?q=%23BlueNeighbourhood',
            promoted_content: null
          },
          {
            name: '#Saints',
            query: '%23Saints',
            url: 'http://twitter.com/search?q=%23Saints',
            promoted_content: null
          },
          {
            name: '#Redskins',
            query: '%23Redskins',
            url: 'http://twitter.com/search?q=%23Redskins',
            promoted_content: null
          },
          {
            name: '#WhoDat',
            query: '%23WhoDat',
            url: 'http://twitter.com/search?q=%23WhoDat',
            promoted_content: null
          },
          {
            name: 'Blac Chyna',
            query: '%22Blac+Chyna%22',
            url: 'http://twitter.com/search?q=%22Blac+Chyna%22',
            promoted_content: null
          },
          {
            name: 'Jarvis Landry',
            query: '%22Jarvis+Landry%22',
            url: 'http://twitter.com/search?q=%22Jarvis+Landry%22',
            promoted_content: null
          }
        ]

        R.forEach(boundInsert, trends)
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