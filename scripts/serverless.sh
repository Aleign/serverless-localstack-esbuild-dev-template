#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: Command argument required. Usage: package-dev.sh [package|deploy] --stage <stage> [--hot-reload]"
    exit 1
fi

COMMAND="$1"
shift  # Remove first argument to process remaining flags

# Use env vars if present, otherwise use defaults
STAGE=${NODE_ENV:-"development"}
HOT_RELOAD=${HOT_RELOAD:-false}
REGION=${AWS_REGION:-"ap-southeast-2"}
PACKAGE_PATH=""
DEBUG=false
# export SERVERLESS_LICENSE_KEY=${SERVERLESS_LICENSE_KEY:-"AKDVDsnQjv7QUjdKHDgaHm28lQLH04w2BlhNyH1rK2BXt"}
# export LAMBDA_MOUNT_CWD=${LAMBDA_MOUNT_CWD:-$PWD} #this doesn't seem to worke


echo $REGION
# Parse remaining arguments - these will override env vars
while [[ $# -gt 0 ]]; do
  case $1 in
    --stage)
      STAGE="$2"
      shift 2
      ;;
    --hot-reload)
      HOT_RELOAD=true
      shift
      ;;
    --debug)
      DEBUG=true
      shift
      ;;
    --package)
      PACKAGE_PATH="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# Run hot-reload setup if enabled
if [ "$HOT_RELOAD" = true ]; then
  LD_LIBRARY_PATH="" AWS_DEFAULT_REGION=$REGION awslocal s3api create-bucket --bucket hot-reload --create-bucket-configuration LocationConstraint=$REGION
  LD_LIBRARY_PATH="" AWS_DEFAULT_REGION=$REGION awslocal ssm put-parameter \
      --name "/serverless-framework/deployment/s3-bucket" \
      --type "String" \
      --value "{\"bucketName\":\"hot-reload\",\"bucketRegion\":\"$REGION\"}"
fi

git config --global --add safe.directory /app

# Add debug flag to command if enabled
DEBUG_FLAG=""
if [ "$DEBUG" = true ]; then
  DEBUG_FLAG="--debug"
fi

# accelerate deploy
ACCELERATE_FLAG=""
if [ "$COMMAND" = "deploy" ]; then
  ACCELERATE_FLAG="--aws-s3-accelerate"
fi

# Add package flag if path is provided
PACKAGE_FLAG=""
if [ ! -z "$PACKAGE_PATH" ]; then
  PACKAGE_FLAG="--package $PACKAGE_PATH"
fi

# USER_ID=501
# GROUP_ID=20
yarn install --frozen-lockfile
# yarn _build
echo "command: sls $COMMAND $PACKAGE_FLAG --stage $STAGE --region $REGION $DEBUG_FLAG $ACCELERATE_FLAG"
rm -rf .serverless
sls $COMMAND $PACKAGE_FLAG --stage $STAGE --region $REGION $DEBUG_FLAG $ACCELERATE_FLAG
rm -Rf lambda-mount
rm -Rf lambda-mount
sleep 1
mkdir -p lambda-mount/.serverless/build
cp -r .serverless/build/node_modules lambda-mount/.serverless/build
cp -r .serverless/build/src lambda-mount/.serverless/build

# echo "User:Group = ${USER_ID:-id -u}:${GROUP_ID:-id -g}"
# chown -R ${USER_ID:-id -u}:${GROUP_ID:-id -u} ./lambda-mount

