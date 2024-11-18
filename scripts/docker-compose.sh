#!/bin/bash
export DU=$(id -u)
export DG=$(id -g)

RM=""
if [ "$1" = "run" ]; then
    RM="--rm"
fi


echo "calling: docker compose $1 --build $RM --remove-orphans $2 $3 $4"
docker compose $1 --build $RM --remove-orphans $2 $3 $4
