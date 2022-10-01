
const inquirer = require('inquirer');
const mysql = require('mysql2');
const company_table = require('console.table');

const tableOptions = [
    {
        type: 'list',
        name: 'choice',
        message: "What would you like to do?",
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit'],
        filter(val) {
            return val;
        }
    }
];

const newDepartment = [
    {
        type: 'input',
        name: 'dept_name',
        message: "What is the name of the department?"
    }
];

const newRole = [
    {
        type: 'input',
        name: 'role_title',
        message: "What is the name of the role?"
    },
    {
        type: 'input',
        name: 'salary',
        message: "What is the salary of the role?"
    },
    {
        type: 'input',
        name: 'dept_id',
        message: "What department id does the role belong to?"
    },
   
];

const newEmployee = [
    
    {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?"
    },
    {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?"
    },
    {
        type: 'input',
        name: 'empl_role',
        message: "What is the employee's role id?"
    },
    {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: ['None','Jhon Doe', 'Mike Chan', 'Ashley Rodriguez','Kevin Tupik', 'Kunal Singh','Malia Brown', 'Sarah Lourd', 'Tom Allen']
    },
];

const updateEmployee = [
    {
        type: 'input',
        name: 'employee',
        message: "Which employee's role do you want to update? Enter the employee id:"
    },
    {
        type: 'input',
        name: 'role',
        message: "Which role do you want to assign the selected employee? Enter the role id:"
    },
];

const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'company_db'
    },
    console.log(`Connected to the company database...`)
  );

async function viewDepartments() {
    db.query('SELECT * FROM department', function(err, result) {
        console.table(result);
    });
}


async function viewRoles() {
    db.query(`select role.id, role.title, department.name as department, role.salary
    from role
    JOIN department ON role.department_id = department.id`, function(err, result) {
        console.table(result);
    });
}

async function viewEmployees() {
        db.query(`select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager
        from employee 
        join role on employee.role_id = role.id
        join department on role.department_id = department.id;`, function(err, result) {
            console.table(result);
        });
}


async function choices(answers) {
    console.log();
    if(answers.choice == "View All Departments") {
        await viewDepartments();
    } else if(answers.choice == "View All Roles") {
        viewRoles();
    } else if(answers.choice == "View All Employees") {
        viewEmployees();
    } else if(answers.choice == "Add Department") {
        await inquirer
            .prompt(newDepartment)
            .then(async (answers) => {
                db.query(`INSERT INTO department (name) VALUES("${answers.dept_name}")`, async function(err, result) {
                    err ? console.log(err) : await console.log(`Added ${answers.dept_name} to the databse`);
                });
            })
            .catch((error) => {
                console.log(error);
        });
    } else if(answers.choice == "Add Role") {
        await inquirer
            .prompt(newRole)
            .then(async (answers) => {
                db.query(`INSERT INTO role (title, department_id, salary) VALUES("${answers.role_title}", ${answers.dept_id}, ${answers.salary})`, async function(err, result) {
                    err ? console.log(err) : await console.log(`Added ${answers.role_title} to the databse`);
                });
            })
            .catch((error) => {
                console.log(error);
        });
    } else if(answers.choice == "Add Employee") {
        await inquirer
            .prompt(newEmployee)
            .then(async (answers) => {
                db.query(`INSERT INTO employee (first_name, last_name,role_id, manager)
                            VALUES("${answers.first_name}", "${answers.last_name}",${answers.empl_role}, "${answers.manager == "None" ? "null" : answers.manager}")` , async function(err, result) {
                    err ? console.log(err) : await console.log(`Added ${answers.first_name} ${answers.last_name} to the databse`);
                });
            })
            .catch((error) => {
                console.log(error);
        });
    } else if(answers.choice == "Update Employee Role") {
        await inquirer
            .prompt(updateEmployee)
            .then(async (answers) => {
                db.query(`UPDATE employee SET Role_id = ${answers.role} WHERE id = ${answers.employee}`, async function(err, result) {
                    err ? console.log(err.sqlMessage) : await console.log(`updated employee's role`);
                });
            })
            .catch((error) => {
                console.log(error);
        });
    } else if(answers.choice == "Exit") {
        process.exit();
    }
    await sleep(1000);
    prompt();
}

function sleep(time) {
    return new Promise((res) => {
        setTimeout(res, time);
    });
}

async function prompt() {
    inquirer
        .prompt(tableOptions)
        .then(async (answers) => {
            await choices(answers);
        })
        .catch((error) => {
            console.log(error);
    });
}

prompt();
