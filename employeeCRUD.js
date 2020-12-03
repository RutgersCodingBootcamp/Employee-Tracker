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

let currentRoles = [];
let currentEmployees = [];

//Populate current Roles
getCurrentRoles();
function getCurrentRoles() {
  //We have to make a query call to the server
  let query = connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;

    for (let i = 0; i < res.length; i++) {
      let role = res[i].title;
      currentRoles.push(role);
    }
  });
  //populate an array and return that array
  //have to loop through the array thats returned from the select
}

//Populate Current Employees
getCurrentEmployees();
function getCurrentEmployees() {
  let query = connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      let first = res[i].first_name;
      let last = res[i].last_name;
      let formatted_name = first + " " + last;
      currentEmployees.push(formatted_name);
    }
  });
}

//=======
//Prompts
//=======
const addEmployeePrompt = [
  { type: "input", name: "first_name", message: "What is their first name?" },
  { type: "input", name: "last_name", message: "What is their last name?" },
  {
    type: "list",
    name: "role",
    message: "What is their role?",
    choices: currentRoles,
  },
];

let removeEmployeePrompt = {
  type: "list",
  name: "employee",
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
    name: "title",
    message: "What role would you like to add?",
  },
  {
    type: "input",
    name: "salary",
    message: "What salary will be attributed to the role? $",
  },
];

let removeRole = {
  type: "list",
  name: "role",
  message: "What role would you like to remove?",
  choices: currentRoles,
};

//==============
//Query Funtions
//==============

//Displays Employees in a Table
function queryEmployees() {
  let query = connection.query(
    "SELECT employee.first_name, employee.last_name, roles.title, roles.salary FROM roles INNER JOIN employee ON roles.id = employee.role_id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}

//Add Employee Function
function queryAddEmployee(empFirst, empLast, role) {
  let query = connection.query(
    "INSERT INTO employee (first_name, last_name, role_id) VALUES ('" +
      empFirst +
      "','" +
      empLast +
      "',(SELECT id FROM roles WHERE title='" +
      role +
      "'));",
    function (err, res) {
      if (err) throw err;
      console.log(query.sql);
    }
  );

  connection.end();
}

//Add Role
function queryAddRole(empTitle, empSalary) {
  let query = connection.query(
    "INSERT INTO roles SET ?",
    {
      title: empTitle,
      salary: empSalary,
    },
    function (err, res) {
      if (err) throw err;
      console.log(query.sql);
    }
  );
  connection.end();
}

//Removes an Employee based on first and last name
function queryRemoveEmployee(first, last) {
  let query = connection.query(
    "DELETE FROM employee WHERE first_name='" +
      first +
      "' AND last_name='" +
      last +
      "'",
    function (err, res) {
      if (err) throw err;
      console.log(query.sql);
    }
  );
}
//Remove Role
function queryRemoveRole(role) {
  let query = connection.query(
    "DELETE FROM roles WHERE title='" + role + "';",
    function (err, res) {
      if (err) throw err;
      console.log(query.sql);
    }
  );
}

//Update Employee Role
function queryUpdateEmployeeRole(first, last, new_role) {
  let query = connection.query(
    "UPDATE employee SET role_id=(SELECT id FROM roles WHERE title='" +
      new_role +
      "')" +
      " WHERE first_name='" +
      first +
      "' AND last_name='" +
      last +
      "';",
    function (err, res) {
      if (err) throw err;
    }
  );
}
function initQuestions() {
  inquirer
    .prompt({
      type: "list",
      name: "decision",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Add Role",
        "Remove Role",
        "Exit",
      ],
    })
    .then((res) => {
      //Check For selection and Prompt user accordingly

      //View All Employees
      if (res.decision === "View all Employees") {
        queryEmployees();
      }
      //Add Employee
      else if (res.decision === "Add Employee") {
        inquirer.prompt(addEmployeePrompt).then((res) => {
          queryAddEmployee(res.first_name, res.last_name, res.role);
        });
      }
      //Remove Employee
      else if (res.decision === "Remove Employee") {
        inquirer.prompt(removeEmployeePrompt).then((res) => {
          //Take from the full name and split into first and last name
          let nameArray = res.employee.split(" ");
          let first_name = nameArray[0];
          let last_name = nameArray[1];
          queryRemoveEmployee(first_name, last_name);
        });
      }
      //Update Employee Role
      else if (res.decision === "Update Employee Role") {
        inquirer.prompt(updateEmployeeRole).then((res) => {
          let nameArray = res.employee.split(" ");
          let first_name = nameArray[0];
          let last_name = nameArray[1];
          queryUpdateEmployeeRole(first_name, last_name, res.role);
        });
      }
      //Add Role
      else if (res.decision === "Add Role") {
        inquirer.prompt(addRole).then((res) => {
          queryAddRole(res.title, res.salary);
        });
      }
      //Remove Role
      else if (res.decision === "Remove Role") {
        inquirer.prompt(removeRole).then((res) => {
          queryRemoveRole(res.role);
        });
      }
      //Exit
      else if (res.decision === "Exit") {
        connection.end();
      }
    });
}
initQuestions();
