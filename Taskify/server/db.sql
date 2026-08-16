create database if not exists taskify;
use taskify;

create table if not exists users(
    id int auto_increment primary key,
    name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) not null,
    created_at TIMESTAMP default current_timestamp
);

create table if not exists tasks(
    id int auto_increment primary key,
    user_id int,
    description text,
    title varchar(300) not null,
    priority ENUM('low' , 'medium' , 'high') default "low",
    status ENUM('yet to start' , 'completed' , 'progress') default "yet to start",
    created_at TIMESTAMP default current_timestamp,
    updated_at TIMESTAMP default current_timestamp,
    foreign key (user_id) references users(id)
);
