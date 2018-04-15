#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER docker WITH PASSWORD 'dockerPassword';
    CREATE DATABASE  docker;
    \connect docker


    CREATE TABLE IF NOT EXISTS users(
        id  SERIAL PRIMARY KEY,
        username           TEXT      NOT NULL,
        password       TEXT NOT NULL,
        created_at     timestamp NOT NULL DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS conversation (
        id          SERIAL PRIMARY KEY,
        title       TEXT      NOT NULL,
        creator_id  INT NOT NULL,
        created_at  timestamp NOT NULL DEFAULT current_timestamp,
        public BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messageType (
        id          SERIAL PRIMARY KEY,
        type       TEXT      NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
        id          SERIAL PRIMARY KEY,
        conversation_id INT REFERENCES conversation(id) ON DELETE RESTRICT,
        sender_id INT REFERENCES users(id) ON DELETE RESTRICT,
        message_type INT REFERENCES messageType(id) ON DELETE RESTRICT,
        message TEXT      NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS conversationusers (
        conversation_id INT REFERENCES conversation(id) ON DELETE RESTRICT,
        user_id INT REFERENCES users(id) ON DELETE RESTRICT
    );

    GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO docker;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO docker;

    INSERT INTO messageType (id,type) VALUES (1, 'message');
    INSERT INTO messageType (id,type) VALUES (1, 'joined');
    INSERT INTO messageType (id,type) VALUES (1, 'left');

EOSQL