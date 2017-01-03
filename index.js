var config = require("./config");
var mosca = require("mosca");
var GcloudPubsubAscoltatore = require("./gcloud-pubsub-ascoltatore");

var moscaConfig = config.mosca;
moscaConfig.ascoltatore = new GcloudPubsubAscoltatore(config.gcloud);
moscaConfig.publishSubscriptions = false;
moscaConfig.publishNewClient = false;
var server = new mosca.Server(moscaConfig);

server.on("clientConnected", function(client) {
  if (client) {
    console.log("Client connected with ID", client.id);
  }
});

server.on("ready", function() {
  console.log("Mosca server is up and running!");
});
