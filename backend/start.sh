#!/bin/sh
set -e

echo "Running database migrations..."
./migrate up

echo "Starting the application..."
./libam-api
