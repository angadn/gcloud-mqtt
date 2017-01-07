var Ascoltatori = require("ascoltatori");
var defer = Ascoltatori.util.defer;

function Ascoltatore(gcloudConfig) {
  this.pubsub = require("@google-cloud/pubsub")(gcloudConfig);
  this.subscriptions = {};
}

// Extend AbstractAscoltatore!
Ascoltatore.prototype = Object.create(
  Ascoltatori.AbstractAscoltatore.prototype
);
Ascoltatore.prototype.constructor = Ascoltatore;

Ascoltatore.prototype.transformResourceName = function(topic) {
  return "a" + topic.replace(/[^a-zA-Z0-9\-_\.\~\+\%]/g, "-");
};

Ascoltatore.prototype.subscribe = function(topicName, callback, done) {
  var self = this;
  this.pubsub.topic(this.transformResourceName(topicName)).get(
    {autoCreate: true}, function(err, topic, apiResponse) {
      topic.subscribe(function(err, subscription) {
        if (subscription) {
          (self.subscriptions[topicName] = self.subscriptions[topicName] || [])
            .push(subscription);

          subscription.on("message", function(message) {
            // Rework into UTF-8
            var arr = message.data.value.data, str = "";
            for (var i = 0; i < arr.length; i++) {
              str += "%" + ("0" + arr[i].toString(16)).slice(-2);
            }
            str = decodeURIComponent(str);

            callback(
              message.data.topic,
              str,
              message.data.options
            );

            console.log(
              "Received message", str,
              "for topic", message.data.topic,
              "and subscription", subscription.name
            );
            message.ack(function() {
              console.log("Acknowledged message ID", message.id);
            });
          });
          subscription.on("error", function(error) {
            console.error(
              "Error", "'" + error + "''", " subscribing to", subscription
            );
          });

          defer(done);
          console.log("Subscribed to", topicName);
        } else {
          console.error("Failed to create Subscription!");
        }
      });
    }
  );
};

Ascoltatore.prototype.publish = function(topicName, payload, options, done) {
  this.pubsub.topic(this.transformResourceName(topicName)).get(
    {autoCreate: true}, function(err, topic, apiResponse) {
      topic.publish({
        value: payload,
        topic: topicName,
        options: options
      }, function(error) {
        if (error) {
          console.error(
            "Error ", "'" + error + "'", " publishing to", topic
          );
        }

        defer(done);
        console.log("Published to", topicName);
      });
    }
  );
};

Ascoltatore.prototype.unsubscribe = function(topicName, callback, done) {
  this.subscriptions[topicName].forEach(function(item) {
    console.log("Deleting subscription", item.name);
    item.delete(function() {
      defer(done);
    });
  });
};

Ascoltatore.prototype.close = function(done) {
  console.warn(
    "GcloudPubsubAscoltatore#close is unimplemented since PubSub",
    "doesn't necessitate it"
  );
};

module.exports = Ascoltatore;
