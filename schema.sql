  
DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Engineering"), ("Finance"), ("Legal"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Lead", 130000, 4), ("Salesperson", 90000, 4), 
("Lead Engineer", 150000, 1), ("Software Engineer", 120000, 1), 
("Accountant", 100000, 2), ("Legal Team Lead", 200000, 3), ("Lawyer", 160000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
 ("John", "Smith", 1, 3),
("Tom", "Hanks", 2, 1),
("Steven", "Spielberg", 3, NULL),
("Marilyn", "Monroe", 4, 3),
("Angelina", "Jolie", 5, NULL),
("Tom", "Cruise", 6, NULL),
("Brad", "Pitt", 7, 6);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;