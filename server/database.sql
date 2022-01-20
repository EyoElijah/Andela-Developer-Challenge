CREATE DATABASE senditdemo;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    registered DATE DEFAULT CURRENT_DATE,
    isadmin BOOLEAN DEFAULT FALSE,
    password VARCHAR(255)

);

DROP TABLE users;
DROP TABLE parcels;

CREATE TYPE status as ENUM ('placed', 'transiting', 'delivered', 'cancelled');

CREATE TABLE parcels (
    id SERIAL PRIMARY KEY,
    placedBy INT,
    weight FLOAT NOT NULL,
    weight_metric VARCHAR(255) NOT NULL,
    sentOn DATE DEFAULT CURRENT_DATE,
    deliveredOn DATE NOT NULL,
    status status DEFAULT 'placed',
    sender_address VARCHAR(100) NOT NULL,
    reciever_address VARCHAR(255) NOT NULL,
    currentLocation VARCHAR(100) NOT NULL,
    FOREIGN KEY (placedBy) REFERENCES users(id)
);




select * from parcels;

select * from users;

