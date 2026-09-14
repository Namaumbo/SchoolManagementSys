#!/bin/bash
set -e

cd /var/www/html

echo "Running deployment tasks..."

mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chmod -R 775 storage bootstrap/cache

if [ -z "${DATABASE_URL:-}" ] && [ -z "${DB_HOST:-}" ]; then
    echo "ERROR: DATABASE_URL (or DB_HOST) is not set."
    echo "Add DATABASE_URL from your Render Postgres dashboard as an environment variable."
    exit 1
fi

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY is not set. Add it as an environment variable on Render."
    exit 1
fi

php artisan config:clear
php artisan route:clear
php artisan view:clear
# File cache clear can fail on a fresh volume; do not block deploy
php artisan cache:clear || true

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

echo "Deployment tasks complete!"
