FROM php:8.2-fpm

WORKDIR /var/app/

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chmod +x /var/app/scripts/deploy.sh

RUN chown -R www-data:www-data /var/app/storage /var/app/bootstrap/cache \
    && chmod -R 775 /var/app/storage /var/app/bootstrap/cache

EXPOSE 80
