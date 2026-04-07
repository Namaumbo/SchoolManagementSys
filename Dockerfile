# 1. Use an optimized PHP + Nginx image
FROM richarvey/nginx-php-fpm:latest

# 2. Set the working directory
WORKDIR /var/www/html

# 3. Copy all application files to the container
COPY . .

# 4. Set critical environment variables for Render & Laravel
# This image uses /var/www/html/public as the web root by default
ENV WEBROOT=/var/www/html/public
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV RUN_SCRIPTS=1
# ENV SKIP_COMPOSER=1
ENV PHP_ERRORS_STDERR=1

# 5. Install production dependencies
# We do this inside the container to ensure architecture compatibility
RUN composer install --no-dev --optimize-autoloader

# 6. Prepare the deployment script
# We move it to a location where the image's entrypoint can find it
RUN chmod +x /var/www/html/scripts/deploy.sh

# 7. Set correct permissions for Laravel folders
# Render runs as 'www-data' or 'root' depending on config; 
# ensuring these are writable prevents 500 errors.
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache


RUN sed -i '/location \/ {/a \        try_files $uri $uri/ /index.php?$query_string;' /etc/nginx/sites-available/default.conf
RUN sed -i 's|root /var/www/html;|root /var/www/html/public;|g' /etc/nginx/sites-available/default.conf


# 8. Expose port 80 (Render's default)
EXPOSE 80

# 9. Define the start command
# This runs your deploy.sh AND starts the Nginx/PHP service
CMD ["/bin/sh", "-c", "/var/www/html/scripts/deploy.sh && /start.sh"]

