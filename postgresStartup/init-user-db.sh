#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER docker WITH PASSWORD 'dockerPassword';
    CREATE DATABASE docker;
    \connect docker


    CREATE TABLE company(
        ID  SERIAL PRIMARY KEY,
        NAME           TEXT      NOT NULL,
        AGE            INT       NOT NULL
    );

    GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO docker;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO docker;
EOSQL