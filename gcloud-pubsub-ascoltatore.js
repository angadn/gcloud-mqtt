var Ascoltatore = require("ascoltatori").AbstractAscoltatore;
var pubsub = require("@google-cloud/pubsub")(
  require("./config").gcloud
);

Ascoltatore.prototype.subscribe = function(topic, callback, done) {
  pubsub.topic(topic).subscribe(function(err, subscription) {
    if (err) {
      console.error(err);
    } else {
      subscription.on("message", callback);
      subscription.on("error", function(error) {
        console.error(
          "Error", "'" + error + "''", " subscribing to", subscription
        );
      });
    }

    done();
  });
};

Ascoltatore.prototype.publish = function(topic, payload, options, done) {
  pubsub.topic(topic).publish(payload, function(error) {
    if (error) {
      console.error(
        "Error ", "'" + error + "'", " publishing to", topic
      );
    }

    done();
  });
};

Ascoltatore.prototype.unsubscribe = function(topic, callback, done) {
  console.warn(
    "GcloudPubsubAscoltatore#unsubscribe is unimplemented since Mosca doesn't",
    "seem to use it"
  );
};

Ascoltatore.prototype.close = function(done) {
  console.warn(
    "GcloudPubsubAscoltatore#close is unimplemented since PubSub",
    "doesn't necessitate it"
  );
};

module.exports.GcloudPubsubAscoltatore = Ascoltatore;
