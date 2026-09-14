#!/bin/bash
set -e

cd /var/www/html

PORT="${PORT:-80}"
export PORT

# Render injects PORT; Apache must listen on it.
sed -i "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/\${PORT}/${PORT}/g" /etc/apache2/sites-available/000-default.conf

if [ -f /var/www/html/scripts/deploy.sh ]; then
    /var/www/html/scripts/deploy.sh
fi

exec apache2-foreground
