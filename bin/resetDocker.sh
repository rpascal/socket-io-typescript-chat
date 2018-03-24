#!/bin/bash
docker stop $(docker ps -aq)
docker rm $(docker ps -a -q)
docker rmi $(docker images --format '{{.Repository}}:{{.Tag}}')
rm -rf data
docker-compose up --build