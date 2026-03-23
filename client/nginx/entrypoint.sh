#!/bin/sh

envsubst < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

mkdir -p /mnt/storage/logs
chmod -R 777 /mnt/storage/logs

exec "$@"
