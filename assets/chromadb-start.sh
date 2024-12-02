#!/bin/bash

CHROMADB_VERSION=<%= chromadbVersion %>
CHROMADB_DIR=<%= chromadbDir %>
CHROMADB_HOST=<%= chromadbHost %>
CHROMADB_PORT=<%= chromadbPort %>

set -e
sudo docker pull chromadb/chroma:$CHROMADB_VERSION

set +e

docker stop -t=10 chromadb
sudo docker rm -f chromadb

set -e

echo "Starting chromadb:$CHROMADB_VERSION"

sudo docker run \
  -d \
  --restart=always \
  --publish=$CHROMADB_HOST:$CHROMADB_PORT:8000 \
  --volume $CHROMADB_DIR/data:/data \
  --name=chromadb \
  chromadb/chroma:$CHROMADB_VERSION
