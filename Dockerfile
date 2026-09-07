FROM php:8.2-fpm

WORKDIR /var/app/ 

COPY . .

RUN 


RUN composer install --no-dev --optimize-autoloader

RUN chmod +x /var/app/scripts/deploy.sh

RUN chown -R www-data:www-data /var/app/storage /var/app/bootstrap/cache
RUN chmod -R 775 /var/app/storage /var/app/bootstrap/cache

EXPOSE 80