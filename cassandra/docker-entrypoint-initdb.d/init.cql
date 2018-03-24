CREATE KEYSPACE IF NOT EXISTS demo
  WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };


CREATE TABLE IF NOT EXISTS demo.users (
    userid uuid PRIMARY KEY,
    first_name text,
    last_name text,
);