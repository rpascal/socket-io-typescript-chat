#!/bin/bash

docker stop $(docker ps -aq)
docker rm $(docker ps -a -q)
rm -rf data
docker-compose up --build