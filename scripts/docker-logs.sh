#!/bin/bash
if [ "$1" = "--filter" ]; then
    FILTER_MODE=true
    CONTAINER_NAME=$2
    DOCKER_FILTER="name=$CONTAINER_NAME"
else
    FILTER_MODE=false
    CONTAINER_NAME=$1
    DOCKER_FILTER="name=^/${CONTAINER_NAME}$"
fi

echo "Waiting for containers matching filter: $DOCKER_FILTER"

while true; do
    for id in $(docker ps -q --filter "$DOCKER_FILTER"); do
        if ! ps aux | grep -v grep | grep "docker logs -f $id" > /dev/null; then
            echo "Starting log stream for container $id"
            docker logs -f $id &
        fi
    done
    sleep 2
done
