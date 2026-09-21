#!/bin/bash
bash scripts/setup-local-env.sh
ng build --configuration test
docker build --platform linux/arm64 -t rtss-ui .
docker tag rtss-ui ezraorina834/rtss-ui:test
docker push ezraorina834/rtss-ui:test
