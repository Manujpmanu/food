#!/bin/bash

# Cleanup script for Food App

echo "🧹 Cleaning up Food App..."
echo "=============================="

# Stop Docker containers
echo "Stopping Docker containers..."
docker-compose down

# Remove Docker images (optional)
read -p "Remove Docker images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing Docker images..."
    docker rmi food-app:latest
    docker rmi node:18-alpine
    docker rmi mongo:6.0-alpine
fi

# Remove node_modules
read -p "Remove node_modules? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing node_modules..."
    rm -rf node_modules
    rm package-lock.json
fi

# Remove build artifacts
echo "Removing build artifacts..."
rm -rf dist
rm -rf coverage
rm -rf .next

# Clean Docker system
read -p "Prune Docker system? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pruning Docker system..."
    docker system prune -f
fi

echo "✓ Cleanup completed!"
echo "=============================="
