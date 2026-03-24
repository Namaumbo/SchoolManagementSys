#!/bin/bash

echo "Running deployment tasks..."

# Exit immediately if a command exits with a non-zero status
set -e

# Cache the configuration and routes for faster performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
# The --force flag is required in production
php artisan migrate --force

echo "Deployment tasks complete!"