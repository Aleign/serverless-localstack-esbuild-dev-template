#!/bin/bash
source ./scripts/set-env-vars.sh $1
yarn stop
yarn start-localstack
yarn deploy-dev
