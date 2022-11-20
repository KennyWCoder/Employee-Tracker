const inquirer = require('inquirer');
const mysql = require('mysql2');
require("console.table");

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

//main menu
function init() {
    inquirer
        .prompt([{
            type: "list",
            name: "start",
            message: "What would you like to do?",
            choices: [
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
        ]).then(function (response) {
            switch (response.start) {
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
                    addDepartment();
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
                    process.exit(0)
            }
        })
};

//view all department with ascending order
function viewDepartments() {
    db.query(`SELECT * FROM department ORDER BY department.id ASC`, (err, res) => {
        if (err) throw err;
        console.log(err);
        console.table(res);
        init();
    });
};

//View roles
function viewRoles() {
    db.query(`SELECT roles.id AS ID, roles.title AS Title, roles.salary AS Salary, department.department_name AS Department FROM roles JOIN department ON roles.department_id = department.id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

//View Employees
function viewEmployees() {
    db.query(`SELECT employee.id AS ID, CONCAT(employee.first_name, ' ', employee.last_name) AS EmployeeName, roles.title AS Title, roles.salary AS Salary, department.department_name AS Department, CONCAT(e.first_name, ' ', e.last_name) AS Manager FROM employee INNER JOIN roles ON roles.id = employee.role_id INNER JOIN department ON department.id = roles.department_id LEFT JOIN employee e on employee.manager_id = e.id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

//Add Department
function addDepartment() {
    inquirer
        .prompt([{
            type: "input",
            name: "addDepartment",
            message: "What department would you like to add?"
        }]).then((res) => {
            db.query(`INSERT INTO department SET ?;`, { department_name: res.addDepartment }, (err, res) => {
                if (err) throw err;
                console.log("New Department has been created!");
                init();
            });
        })
};

//Adding new roles
function addRole() {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        const departmentList = res.map(department => ({ name: department.department_name, value: department.id }))
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the new role's title?"
                },
                {
                    type: "number",
                    name: "salary",
                    message: "What is the new role's salary?"
                },
                {
                    type: "list",
                    name: "department",
                    message: "Please select the department for this new role.",
                    choices: departmentList
                }
            ]).then((res) => {
                db.query(`INSERT INTO roles SET ?;`, 
                {   title: res.title,
                    salary: res.salary,
                    department_id: res.department}, (err, result) => {
                    if (err) throw err;
                    console.log("New Role has been created!");
                    init();
                });
            })
    })
};

//Adding employee
function addEmployee() {
    db.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        const rolesList = res.map(roles => ({ name: roles.title, value: roles.id }));

        db.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;
            const employeesList = res.map(employee => ({
                name: employee.first_name + employee.last_name,
                value: employee.id
            }));
        
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Please enter the new employee's first name."
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Please enter the new employee's last name."
                },
                {
                    type: "list",
                    name: "role",
                    message: "Please select the role for the new employee.",
                    choices: rolesList
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Please assign a manager to the new employee.",
                    choices: employeesList
                }
            ]).then((res) => {
                db.query(`INSERT INTO employee SET ?;`,
                    {
                        first_name: res.firstName,
                        last_name: res.lastName,
                        role_id: res.role,
                        manager_id: res.manager
                    }, (err, result) => {
                        if (err) throw err;
                        console.log("New Employee has been created!");
                        init();
                    });
            })
    })
})
};

//Update an employee's role
function updateEmployeeRole() {
    db.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        const rolesList = res.map(roles => ({ name: roles.title, value: roles.id }));

        db.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;
            const employeesList = res.map(employee => ({
                name: employee.first_name + employee.last_name,
                value: employee.id
            }));
        
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employees",
                    message: "Please select the employee who you would like to update.",
                    choices: employeesList
                },
                {
                    type: "list",
                    name: "roles",
                    message: "Please select the new role for the employee.",
                    choices: rolesList
                },
            ]).then((res) => {
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`,
                    [
                        res.roles,
                        res.employees,
                    ], (err, result) => {
                        if (err) throw err;
                        console.log("Your selected employee's role has been updated!");
                        init();
                    });
            })
    })
})
};

