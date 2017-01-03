# gcloud-mqtt
Massively scale push-messaging on MQTT backed by Google Cloud's PubSub! Easily deployable anywhere with Docker.

### How to run
```
cd /path/to/gcloud-mqtt
cp ~/Downloads/my-gcloud-service-key.json ./gcloud.json
docker build -t gcloud-mqtt .
docker run --name pubsub-1 -p 1883:1883 -p 9001:9001 -d gcloud-mqtt
```
