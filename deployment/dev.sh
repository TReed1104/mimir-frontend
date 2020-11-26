#!/bin/sh
echo ---------------------------------------
echo Deployment Start - Development
echo ---------------------------------------
echo Building and Deploying Mimir Frontend
echo ---------------------------------------
docker-compose -p mimir-frontend-dev -f docker-compose.dev.yml up -d --build --remove-orphans
echo
echo ---------------------------------------
echo Conntainer Status:
echo ---------------------------------------
docker ps | grep 'mimir-frontend'