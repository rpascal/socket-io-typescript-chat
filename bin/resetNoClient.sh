#!/bin/bash

docker stop $(docker ps -aq)
docker rm $(docker ps -a -q)
docker rmi $(docker images --format '{{.Repository}}:{{.Tag}}')
docker rmi $(docker images -q)
rm -rf data
sudo docker-compose up --build server dbpostgres