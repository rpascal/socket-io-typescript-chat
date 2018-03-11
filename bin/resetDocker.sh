#!/bin/bash

docker stop $(docker ps -aq)
docker rm $(docker ps -a -q)
docker rmi $(docker images -a -q)
docker-compose up --build