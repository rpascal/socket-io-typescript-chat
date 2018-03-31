#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER docker WITH PASSWORD 'dockerPassword';
    CREATE DATABASE  docker;
    \connect docker


    CREATE TABLE IF NOT EXISTS users(
        ID  SERIAL PRIMARY KEY,
        NAME           TEXT      NOT NULL,
        password       TEXT NOT NULL,
        created_at     timestamp NOT NULL DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS conversation (
        ID          SERIAL PRIMARY KEY,
        title       TEXT      NOT NULL,
        creator_id  INT NOT NULL,
        created_at  timestamp NOT NULL DEFAULT current_timestamp,
        public BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messageType (
        ID          SERIAL PRIMARY KEY,
        type       TEXT      NOT NULL
    );


    CREATE TABLE IF NOT EXISTS messages (
        ID          SERIAL PRIMARY KEY,
        conversation_id INT REFERENCES conversation(ID) ON DELETE RESTRICT,
        sender_id INT REFERENCES users(ID) ON DELETE RESTRICT,
        message_type INT REFERENCES messageType(ID) ON DELETE RESTRICT,
        message TEXT      NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp
    );



    GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO docker;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO docker;
EOSQL