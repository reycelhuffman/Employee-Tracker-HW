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
                console.table(department);
                return addDepartment();
            }
            else if (response.questions === "Add a role") {
                console.table(role);
                return addRole();
            }
            else if (response.questions === "Add an employee") {
                // console.table(employees);
                return addEmployees();
            }
            else if (response.questions === "Update an employee role") {
                console.table(employees);
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



    /// write next sql statements here! you would do some sort of sql query after this







// async function awaitWithInquirerByItself() {


//     const { size } = await prompt([{
//         type: 'list',
//         name: 'size',
//         message: 'What size do you need?',
//         choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro']
//     }])

//     console.log(size);

// }

// employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee }))
