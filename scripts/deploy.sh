#!/bin/bash

echo "Running deployment tasks..."

set -e

php artisan config:clear
php artisan route:clear
php artisan cache:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

echo "Deployment tasks complete!"