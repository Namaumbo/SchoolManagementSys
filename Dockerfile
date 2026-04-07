FROM richarvey/nginx-php-fpm:latest

WORKDIR /var/www/html
COPY . .

ENV WEBROOT=/var/www/html/public
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV RUN_SCRIPTS=1
ENV PHP_ERRORS_STDERR=1

RUN composer install --no-dev --optimize-autoloader

RUN chmod +x /var/www/html/scripts/deploy.sh

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# ✅ ONLY keep this
RUN sed -i 's|root /var/www/html;|root /var/www/html/public;|g' /etc/nginx/sites-available/default.conf

EXPOSE 80

CMD ["/bin/sh", "-c", "/var/www/html/scripts/deploy.sh && /start.sh"]