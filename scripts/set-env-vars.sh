#!/bin/bash
LAMBDA_DEBUG_MODE=${LAMBDA_DEBUG_MODE:-0}
LAMBDA_LOG_LEVEL=${LAMBDA_LOG_LEVEL:-info}
DEBUG=${LOCALSTACK_MAIN_DEBUG:-0}
LAMBDA_MOUNT_CWD=${LAMBDA_MOUNT_CWD}
AWS_REGION=${AWS_REGION:-"ap-southeast-2"}
NODE_ENV=${NODE_ENV:-"development"}
CUSTOM_ID=${CUSTOM_ID:-"myservice"}

if [ "$1" = "--debugmode" ]; then
  echo "Setting to debug mode"
  LAMBDA_DEBUG_MODE=1
  LAMBDA_LOG_LEVEL=debug
  DEBUG=1
  LAMBDA_MOUNT_CWD=${LAMBDA_MOUNT_CWD:-${PWD}/lambda-mount}
fi

export LAMBDA_DEBUG_MODE=$LAMBDA_DEBUG_MODE
export LAMBDA_LOG_LEVEL=$LAMBDA_LOG_LEVEL
export DEBUG=$DEBUG
export LAMBDA_MOUNT_CWD=$LAMBDA_MOUNT_CWD
export AWS_REGION=$AWS_REGION
export NODE_ENV=$NODE_ENV

