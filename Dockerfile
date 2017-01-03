FROM node:7.2.1

# Install forever
RUN npm install -g forever

# Create directory for our sources and logs
RUN mkdir -p /usr/src/gcloud-mqtt
WORKDIR /usr/src/gcloud-mqtt

# Install dependencies
COPY ./package.json /usr/src/gcloud-mqtt/package.json
RUN npm install

# Bundle app sources
COPY . /usr/src/gcloud-mqtt
COPY gcloud.json /usr/src/gcloud-mqtt/gcloud.json

EXPOSE 1883
EXPOSE 9001

ENTRYPOINT forever -l ./forever.log -e ./error.log -o ./out.log ./index.js
