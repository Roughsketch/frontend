-- Your SQL goes here
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (username, password)
VALUES("admin", "$2y$12$gHuhE47KWxO9WYhfVvqeMOb2cKQIweuJvADThQi5E1F0NpRrjP61a");