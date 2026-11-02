#!/bin/bash
set -euo pipefail

: "${APP_VERSION:?APP_VERSION must be set, e.g. APP_VERSION=1.0.0 ./deploy.sh}"

ng build --configuration production
docker build --platform linux/arm64 -t rtss-ui .
docker tag rtss-ui ezraorina834/rtss-ui:"$APP_VERSION"
docker push ezraorina834/rtss-ui:"$APP_VERSION"
