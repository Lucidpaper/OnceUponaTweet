//get top trends and tweet something

let trendJobs = JobCollection(
  'trendJobsCollection',
  // remove the ".jobs" suffix from the collection name
  {'noCollectionSuffix': true}
);

// on startup, remove all old email jobs (jc.forever causes repeating
// jobs to remain after server restart)
Meteor.startup(function () {
  trendJobs.remove({type: 'trendJob'});
  createTrendJob();
});

// create a queueCharges job at a set interval, which repeats infinitely
let createTrendJob = function () {
  new Job(trendJobs, 'trendJob', {})
    .priority('normal')
    .retry({
      retries: 5,                         // If fail, retry 5 times
      wait: 30 * 1000                     // half a minute between attempts
    })
    .repeat({
      repeats: trendJobs.forever,  // repeats forever
      wait: 24 * 60 * 60 * 1000                // day between repeats
      //wait: 1000
    })
    .save();                               // Submit job to the queue
};


//let boundInsert = Meteor.bindEnvironment(trend => {
//  Trends.insert({trend});
//}, 'Failed to insert trend into Posts collection.');

trendJobs.processJobs(
  "trendJob",
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
        //console.log(err)
        //console.log(data)
        //console.log(response)
        //
        //let trends = data[0].trends

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
        ];
        //logEach(trends);

        //R.forEach(boundInsert, trends)

        let trend1 = trends[0].name;
        let trend2 = trends[1].name;

        let starterTemplates = [
          `"Once upon a tweet, ${trend1} and ${trend2}..."`,
          `"And then ${trend1} said to ${trend2}..."`,
          `"When they first met, ${trend1} and ${trend2}..."`,
          `"In an alternate universe, ${trend1} and ${trend2}..."`,
          `"In a world broken by ${trend1} and ${trend2}..."`,
          `"What happens between ${trend1} and ${trend2}..."`
        ];
        //console.log(starterTemplates)

        let randNum = Math.floor(Math.random() * starterTemplates.length) - 1;
        //console.log(randNum)

        let starter = starterTemplates[randNum];
        //console.log(starter)

        let starterTweet = `Today's story starter: ${starter}.  #OUaT_daily, http://ouat.meteor.com/`;
        console.log(starterTweet)

        //T.post('statuses/update', {status: starterTweet}, function (err, data, response) {
        //  //console.log(err)
        //  console.log(data)
        //  //console.log(response)
        //})
      });

      job.done(
        console.log("trend job done")
        //bind the asynchronous callback
        //Meteor.bindEnvironment(function (err, res) {
        //  if (!err) {
        //    job.remove();
        //  }
        //})
      );
    } catch (e) {
      job.fail('trend job failed');
    }
    finally {
      cb();
    }
  }
);

trendJobs.startJobServer();