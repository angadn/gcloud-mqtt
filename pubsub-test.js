var pubsub = require("@google-cloud/pubsub")(require("./config").gcloud);
pubsub.topic("foo-topic").get({autoCreate: true}, function(err, topic) {
  topic.subscribe(function(err, sub) {
    sub.on("message", console.log);
    topic.publish("foo");
  });
});
