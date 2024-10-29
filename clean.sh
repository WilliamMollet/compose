#!/bin/bash

if [ "$1" == "bdd" ]; then
    docker-compose down --volumes
    docker volume prune -f
elif [ "$1" == "all" ]; then
    docker-compose down --volumes --remove-orphans
    docker volume prune -f
    docker network prune -f
    rm -rf ./backend/node_modules ./frontend/node_modules
    echo "Cleaning complete."
else
    echo "Usage: ./clean.sh [bdd|all]"
fi
