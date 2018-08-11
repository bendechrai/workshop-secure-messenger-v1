#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

# Install required packages
debconf-set-selections <<< 'mariadb-server-10.0 mysql-server/root_password password pass'
debconf-set-selections <<< 'mariadb-server-10.0 mysql-server/root_password_again password pass'
apt update
apt install -y vim curl git unzip mariadb-client mariadb-server nginx-full php7.0 php7.0-cli php7.0-mbstring php7.0-mcrypt php7.0-mysql php7.0-fpm php7.0-xml php7.0-zip ssl-cert

# Set shell for www-data user
usermod -s /bin/bash www-data

# Set up database
mysql -e 'grant all on *.* to user@localhost identified by "pass"'
mysqladmin flush-privileges
mysqladmin create step1
mysqladmin create step2
mysqladmin create step3
mysqladmin create step4
mysqladmin create step5
mysqladmin create step6
mysqladmin create step7
mysqladmin create step8

# Install Composer, and make sure www-data can cache composer files
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php --install-dir=/usr/local/bin --filename=composer
php -r "unlink('composer-setup.php');"
chown www-data.www-data /var/www

# Install Node/NPM
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Run installers for each docroot
cd /vagrant/docroots
for step in step*
do
  cd $step
  su www-data -s /bin/bash -c "composer install"
  su www-data -s /bin/bash -c "npm install"
  su www-data -s /bin/bash -c "php artisan migrate"
done

cp /vagrant/vagrant_files/default /etc/nginx/sites-available
nginx -t && service nginx reload
