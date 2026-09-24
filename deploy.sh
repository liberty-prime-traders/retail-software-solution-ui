#!/bin/bash
ng build --configuration production
docker build --platform linux/arm64 -t rtss-ui .
docker tag rtss-ui ezraorina834/rtss-ui:latest
docker push ezraorina834/rtss-ui:latest
