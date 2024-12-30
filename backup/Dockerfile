FROM alpine:latest

RUN apk update && apk add --no-cache bash postgresql-client dcron tini

COPY ./backup.sh /backup/backup.sh
RUN chmod +x /backup/backup.sh

RUN echo "0 2 * * * /bin/bash /backup/backup.sh" > /etc/crontabs/root

RUN touch /var/log/cron.log && chmod 666 /var/log/cron.log

ENTRYPOINT ["/sbin/tini", "--", "crond", "-f", "-L", "/var/log/cron.log"]
