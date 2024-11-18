#!/bin/bash
yarn stop
docker system prune -f
rm -Rf .packaged
rm -Rf .serverless
rm -Rf .localstack_data
rm -Rf lambda-mount
rm -Rf esbuild-meta
rm -Rf dist
rm -Rf .packaged
rm -Rf .serverless
rm -Rf .localstack_data
rm -Rf lambda-mount
rm -Rf esbuild-meta
rm -Rf dist
