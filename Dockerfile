# Use the official PHP image as the base image
FROM php:8-apache

# Set the working directory inside the container
WORKDIR /var/www/html


# Install system dependencies
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the Laravel project files into the container
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set the appropriate file permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose the container port
EXPOSE 80

