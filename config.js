module.exports = {
  gcloud: {
    projectId: "tincan-1271",
    keyFilename: "./gcloud.json"
  },
  mosca: {
    port: 1883,
    http: {
      port: 9001,
      bundle: true,
      static: "./"
    }
  }
};
