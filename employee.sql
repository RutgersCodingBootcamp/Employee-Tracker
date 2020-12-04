DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;
-- 
-- Init DATABASE TABLES
-- 
CREATE TABLE employee (
 id INT NOT NULL AUTO_INCREMENT,
 first_name VARCHAR(30) NOT NULL,
 last_name VARCHAR(30) NOT NULL,
 role_id INT,
 PRIMARY KEY(id)
);
CREATE TABLE roles (
 id INT NOT NULL AUTO_INCREMENT,
 title VARCHAR(30),
 salary DECIMAL(10, 2),
 department_id INT,
 PRIMARY KEY(id)
);
-- 
-- Inserts
-- 
INSERT INTO employee (first_name, last_name, role_id)
VALUES("John", "Doe", 2),
 ("Jane", "Doe", 3),
 ("Rob", "Lowe", 3);
INSERT INTO roles (title, salary, department_id)
VALUES("Salesman", 50000, 3),
 ("Executive", 150000, 2),
 ("Recruiter", 70000, 1);