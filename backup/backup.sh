#!/bin/bash

BACKUP_DIR="/backup"
DATE=$(date +'%Y%m%d%H%M%S')
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.sql"

DB_NAME="${POSTGRES_DB}"
DB_USER="${POSTGRES_USER}"
DB_PASSWORD="${POSTGRES_PASSWORD}"

PGPASSWORD=$DB_PASSWORD pg_dump -h db -U $DB_USER -F c -b -v -f $BACKUP_FILE $DB_NAME

echo "Backup created: $BACKUP_FILE"
