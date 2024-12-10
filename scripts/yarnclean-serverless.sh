#!/bin/bash

if [ "$NODE_ENV" = "development" ]; then
  cd .esbuild/.build
else
  cd .esbuild/.serverless
fi

# Find and verify zip file exists
ZIP_FILE=$(find . -maxdepth 1 -name "*.zip")
if [ -z "$ZIP_FILE" ]; then
    echo "No zip file found in .serverless/build"
    exit 1
fi

# Store just the filename without path
ZIP_NAME=$(basename "$ZIP_FILE")

# Backup original zip
mv "$ZIP_FILE" "${ZIP_NAME}.backup"

# Create and extract to temp directory
mkdir temp
unzip -q -o "${ZIP_NAME}.backup" -d temp

# Copy yarnclean and run autoclean from inside temp directory
cp ../../.yarnclean temp/
cp package.json temp/
cp yarn.lock temp/
cd temp
yarn autoclean --force
rm package.json
rm yarn.lock
rm .yarnclean

# Create new zip from inside temp directory with original name
zip -q -r "../$ZIP_NAME" *

# Go back and cleanup
cd ..
rm -rf temp
sleep 1
#need to run this twice as sometimes it fails with permission denied on some folders the first time
rm -rf temp
rm "${ZIP_NAME}.backup"

cd ../../
