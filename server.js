const { response } = require("express");
const { prompt } = require("inquirer");
const mysql = require('mysql2/promise');
let db;


awaitMySqlWithInquirer();

async function init() {
    db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'employees_db'
        },
        console.log(`Connected to the employees_db database.`)
    );


}

async function awaitMySqlWithInquirer() {
    await init()

    const [employees] = await db.execute("select * from employee");
    const [role] = await db.execute("select * from employee_role");
    const [department] = await db.execute("select * from department");




    await prompt([
        {
            type: 'list',
            name: 'questions',
            message: 'What would you like to do?',
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
        },
    ])
        .then(function (response) {
            if (response.questions === "View all departments") {
                console.table(department);
                return awaitMySqlWithInquirer();
            }
            else if (response.questions === "View all roles") {
                console.table(role);
                return awaitMySqlWithInquirer();
            }
            else if (response.questions === "View all employees") {
                console.table(employees);
                return awaitMySqlWithInquirer();
            }
            else if (response.questions === "Add a department") {
                return addDepartment();
            }
            else if (response.questions === "Add a role") {
                return addRole();
            }
            else if (response.questions === "Add an employee") {
                return addEmployees();
            }
            else if (response.questions === "Update an employee role") {
                return updateEmployeeRole();
            }
            else console.log("You can exit if you're done")
        })

}

async function addEmployees() {
    await init()

    const [employees] = await db.execute("select * from employee")
    const [roles] = await db.execute("select * from employee_role");


    console.table(employees);

    const response = await prompt([
        {
        type: 'input',
        name: 'first',
        message: 'What is the employee first name?',
        },
        {
        type: 'input',
        name: 'last',
        message: 'What is the employee last name?',
        },
        {
        type: 'list',
        name: 'chooseRole',
        message: 'What is the employee role?',
        choices: roles.map(role=> ({name:role.id + ": "+ role.title, value: role}))
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee manager?',
            choices: employees.map(employee=> ({name:employee.first_name + " "+ employee.last_name, value: employee}))
        },
])
db.execute(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES  ("${response.first}", "${response.last}", ${response.chooseRole.id}, ${response.manager.id});`)
            const [newEmployeesTable] = await db.execute("select * from employee")
            console.log("New Employee Added!! Yah!")
            console.table(newEmployeesTable) 
            awaitMySqlWithInquirer()       


}

async function addDepartment() {
    await init()

    const [department] = await db.execute("select * from department");


    console.table(department);

    const response = await prompt([
        {
        type: 'input',
        name: 'departmentName',
        message: 'What is the new department name?',
        },
])
db.execute(`INSERT INTO department (name)
            VALUES  ("${response.departmentName}");`)
            const [newDepartmentTable] = await db.execute("select * from department")
            console.log("New Department Added!! Yah!")
            console.table(newDepartmentTable) 
            awaitMySqlWithInquirer()       
}

async function addRole() {
    await init()

    const [departments] = await db.execute("select * from department")
    const [roles] = await db.execute("select * from employee_role");


    console.table(roles);

    const response = await prompt([
        {
        type: 'input',
        name: 'newRole',
        message: 'What is the departments new role?',
        },
        {
        type: 'input',
        name: 'salary',
        message: 'How much is the salary?',
        },
        {
        type: 'list',
        name: 'chooseDepartment',
        message: 'What department does it belong to?',
        choices: departments.map(department => ({name: department.name, value: department}))
        },
])
db.execute(`INSERT INTO employee_role (title, salary, department_id)
            VALUES  ("${response.newRole}", "${response.salary}", ${response.chooseDepartment.id});`)
            const [newRoleTable] = await db.execute("select * from employee_role")
            console.log("New Role Added!! Yah!")
            console.table(newRoleTable) 
            awaitMySqlWithInquirer()       


}

async function updateEmployeeRole() {
    await init()

    const [employees] = await db.execute("select * from employee")
    const [roles] = await db.execute("select * from employee_role");


    console.table(roles);

    const response = await prompt([
        {
        type: 'list',
        name: 'updateEmployee',
        message: 'Which employee would you like to update?',
        choices: employees.map(employee=> ({name:employee.first_name + " "+ employee.last_name, value: employee}))
        },
        {
        type: 'list',
        name: 'updateRole',
        message: 'what role would you like to update the employee to?',
        choices: roles.map(role=> ({name:role.id + ": "+ role.title, value: role}))
        },
])
db.execute( `UPDATE employee SET role_id =${response.updateRole.id} WHERE id = ${response.updateEmployee.id}`)
            console.log("________________________________________________________________")
            console.log("|                     Old Employee Table                       |")
            console.table(employees)
            const [updateEmployeeRoleTable] = await db.execute("select * from employee")
            console.log("Updated Employee Role Yay!") 
            console.log("|                    Updated Employee Table                    |")
            console.table(updateEmployeeRoleTable)
            awaitMySqlWithInquirer()       

}

