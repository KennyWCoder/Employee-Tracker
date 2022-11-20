const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable =require("console.table");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(""),
    console.log("┌──────────────────────────────────────┐"),
    console.log("│                                      │"),
    console.log("│               Employee               │"),
    console.log("│               Mangager               │"),
    console.log("│                                      │"),
    console.log("└──────────────────────────────────────┘"),
    console.log("")
);

db.connect((err) => {
    if (err) throw err;
    init();
});

function init() {
    inquirer
        .prompt([{
            type: "list",
            name: "start",
            message: "What would you like to do?",
            choice: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Quit"
            ]
        }
        ]).then(function (start) {
            switch (start) {
                case "View All Departments":
                    viewDepartments();
                    break;

                case "View All Roles":
                    viewRoles();
                    break;

                case "View All Employees":
                    viewEmployees();
                    break;

                case "Add Department":
                    addDepartments();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Quit":
                    console.log("Bye!");
            }
        })
};