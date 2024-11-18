#!/bin/bash
curl -X POST http://localhost:4566/_localstack/state/save
yarn kill-localstack
yarn kill-lambda
