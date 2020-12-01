const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});
let currentEmployees = ["Mark", "Jon"];
let currentRoles = ["Sales-Guy", "Boss-Mans", "Operator"];

const addEmployeePrompt = [
  { type: "input", name: "first_name", message: "What is their first name?" },
  { type: "input", name: "last_name", message: "What is their last name?" },
  { type: "input", name: "role", message: "What is their role?" },
];

let removeEmployeePrompt = {
  type: "list",
  name: "remove",
  message: "Which employee would you like to remove?",
  choices: currentEmployees,
};

let updateEmployeeRole = [
  {
    type: "list",
    name: "employee",
    message: "Which employee's role would you like to update?",
    choices: currentEmployees,
  },
  {
    type: "list",
    name: "role",
    message: "Which role would you like to change it to?",
    choices: currentRoles,
  },
];

let updateEmployeeManager = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to make a Manager?",
    choices: currentEmployees,
  },
];

const addRole = [
  {
    type: "input",
    name: "role",
    message: "What role would you like to add?",
  },
  {
    type: "input",
    name: "salary",
    message: "What salary will be attributed to the role?",
  },
];

let removeRole = {
  type: "list",
  name: "role",
  message: "What role would you like to remove?",
  choices: currentRoles,
};

inquirer
  .prompt({
    type: "list",
    name: "decision",
    message: "What would you like to do?",
    choices: [
      "View all Employees",
      "View All Employees by Department",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "Add Role",
      "Remove Role",
    ],
  })
  .then((res) => {
    //Check For selection and Prompt user accordingly

    //View All Employees
    if (res.decision === "View all Employees") {
    }
    //View all Employees by Department
    else if (res.decision === "View all Employees by Department") {
    }
    //Add Employee
    else if (res.decision === "Add Employee") {
      inquirer.prompt(addEmployeePrompt).then((res) => {});
    }
    //Remove Employee
    else if (res.decision === "Remove Employee") {
      inquirer.prompt(removeEmployeePrompt).then((res) => {});
    }
    //Update Employee Role
    else if (res.decision === "Update Employee Role") {
      inquirer.prompt(updateEmployeeRole).then((res) => {});
    }
    //Update Employee Manager
    else if (res.decision === "Update Employee Manager") {
      inquirer.prompt(updateEmployeeManager).then((res) => {});
    }
    //Add Role
    else if (res.decision === "Add Role") {
      inquirer.prompt(addRole).then((res) => {});
    }
    //Remove Role
    else if (res.decision === "Remove Role") {
      inquirer.prompt(removeRole).then((res) => {});
    }

    connection.end();
  });
