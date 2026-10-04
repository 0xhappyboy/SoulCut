#!/bin/sh
set -e

REDIS_HOST="redis"
REDIS_PORT="6379"
REDIS_PASSWORD="root123456"

echo "Waiting for Redis..."
until redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" ping 2>/dev/null | grep -q PONG; do
  sleep 1
done

echo "Initializing Redis data..."
# TODO: 

echo "Redis init done."