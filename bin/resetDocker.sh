#!/bin/bash

docker stop $(docker ps -aq)
docker rm $(docker ps -a -q)
docker rmi $(docker images --format '{{.Repository}}:{{.Tag}}')
docker-compose up --build