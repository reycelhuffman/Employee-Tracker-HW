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
    .then (function(response) {
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
    // console.log(employee)
    // console.table(employees);
    // console.table(role);
   

    /// write next sql statements here! you would do some sort of sql query after this

    })
}




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
