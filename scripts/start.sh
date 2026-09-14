#!/bin/bash
set -e

cd /var/www/html

PORT="${PORT:-80}"
export PORT

# Render injects PORT; Apache must listen on it.
sed -i "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/\${PORT}/${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Ensure Render Postgres URL uses SSL when present
if [ -n "${DATABASE_URL:-}" ] && [[ "${DATABASE_URL}" != *"sslmode="* ]]; then
    if [[ "${DATABASE_URL}" == *"?"* ]]; then
        export DATABASE_URL="${DATABASE_URL}&sslmode=require"
    else
        export DATABASE_URL="${DATABASE_URL}?sslmode=require"
    fi
fi

/var/www/html/scripts/deploy.sh

exec apache2-foreground
