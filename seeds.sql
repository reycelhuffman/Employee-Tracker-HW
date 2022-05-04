INSERT INTO department (name)
VALUES  ("Human Resources"),
        ("Administration"),
        ("Enginner"),
        ("Marketing");

INSERT INTO employee_role (title, salary, department_id)
VALUES  ("Talent Management", 61000, 1),
        ("Planning", 48000, 2),
        ("Design Enginnering", 105000, 3),
        ("Content Marketing", 86000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Bruno", "Mars", 1, 1),
        ("Celine", "Dion", 2, 1),
        ("Dua", "Lipa", 3, 2),
        ("Adam", "Levine", 4, 2);


SELECT * FROM employee



