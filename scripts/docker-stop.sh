#!/bin/bash
CONTAINERS=$(docker ps -aq --filter name=$1)
if [ ! -z "$CONTAINERS" ]; then
    docker stop $CONTAINERS
    docker kill $CONTAINERS
    docker rm -f $CONTAINERS
fi
