
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "a12345678",
  database: "employee_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log(connection.threadId);
  start();
});

function validateEntry(name){
  return name !== '';
};

async function start() {
    try {
      const questions = await inquirer.prompt([
        {
          type: "list",
          message: "What would you like to do? ",
          name: "startWhat",
          choices: [
              "View All Departments",
              "View All Roles",
              "View All Employees",
              "Add A Department",
              "Add A Role",
              "Add An Employee",
              "Update An Employee's Role",
              "Update An Employee's Manager",
              "Delete A Department",
              "Delete A Role",
              "Delete An Employee",
              "Exit"
          ]
        }])
        .then(function(answer) {
            switch (answer.startWhat) {
            case "View All Departments":
              allDepartments();
              break;
      
            case "View All Roles":
              allRoles();
              break;
      
            case "View All Employees":
              allEmployees();
              break;
      
            case "Add A Department":
              addDept();
              break;

            case "Add A Role":
              addRole();
              break;

            case "Add An Employee":
              addEmploy();
              break;

            case "Update An Employee's Role":
              updateRole();
              break;

            case "Update An Employee's Manager":
              updateManager();
              break;

            case "Delete A Department":
              delDept();
              break;

            case "Delete A Role":
              delRole();
              break;

            case "Delete An Employee":
              delEmploy();
              break;
      
            case "Exit":
              connection.end();
              break;
            }
          });

    } catch (err) {
      console.log(err);
    }
  }

  function allDepartments() {
    connection.query("SELECT * FROM department;", function(err, res) {
          if (err) throw err;
          console.table(res);
          start();
          });
  };

  function allRoles() {
    connection.query("SELECT * FROM role;", function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
      })
};

function allEmployees() {
  connection.query("SELECT * FROM employee;", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
    })
};

function addDept() {
  inquirer
  .prompt([
    {
      name: "deptName",
      type: "input",
      message: "What is the name of the department that you would like to add?",
      validate: validateEntry
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO department SET ?", {"name": answer.deptName}, function(err) {
        if (err) throw err;
        console.log("Department added successfully!");
        start();
      }
    );
  });
}

function addRole() {
  inquirer
  .prompt([
    {
      name: "title",
      type: "input",
      message: "What is the title of the role you would like to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary for this title?"
    },
    {
      name: "dept",
      type: "input",
      message: "Which department does this role belong to?"
    },

  ])
  .then(function(answer) {
    answer.dept = answer.dept.toLowerCase();
    if (answer.dept === "engineering") {
      answer.dept = 1;
    } else if (answer.dept === "finance") {
      answer.dept = 2;
    } else if (answer.dept === "legal") {
      answer.dept = 3;
    } else if (answer.dept === "sales") {
      answer.dept = 4;
    } else if (answer.dept === "it") {
      answer.dept = 5;
    };

    connection.query(
      "INSERT INTO role SET ?", 
      {
        "title": answer.title, 
        salary: answer.salary, 
        department_id: answer.dept
      },
      function(err) {
        if (err) throw err;
        console.log("Role added successfully!");
        start();
      }
    );
  });
};

function addEmploy() {
  inquirer
  .prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the employee that you would like to add?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the employee that you would like to add?"
    },
    {
      name: "role",
      type: "input",
      message: "What is the employee's role?"
    },
    {
      name: "manager",
      type: "input",
      message: "Who is the employee's manager? (Press ENTER if DNA)"
    },
  ])
  .then(function(answer) {
    answer.role = answer.role.toLowerCase();
    if (answer.role === "sales lead") {
      answer.role = 1;
    } else if (answer.role === "salesperson") {
      answer.role = 2;
    } else if (answer.role === "lead engineer") {
      answer.role = 3;
    } else if (answer.role === "software engineer") {
      answer.role = 4;
    } else if (answer.role === "accountant") {
      answer.role = 5;
    } else if (answer.role === "legal team lead") {
      answer.role = 6;
    } else if (answer.role === "lawyer") {
      answer.role = 7;
    };

    answer.manager = answer.manager.toLowerCase();
    if (answer.manager  === "john smith") {
      answer.manager = 1;
    } else if (answer.manager === "tom hanks") {
      answer.manager = 2;
    } else if (answer.manager === "steven spielberg") {
      answer.manager = 3;
    } else if (answer.manager === "marilyn monroe") {
      answer.manager = 4;
    } else if (answer.manager === "angelina jolie") {
      answer.manager = 5;
    } else if (answer.manager === "tom cruise") {
      answer.manager = 6;
    } else if (answer.manager === "brad pitt") {
      answer.manager = 7;
    };

    connection.query(
      "INSERT INTO employee SET ?", 
      {
        "first_name": answer.firstName, 
        "last_name": answer.lastName, 
        role_id: answer.role,
        manager_id: answer.manager
      },
      function(err) {
        if (err) throw err;
        console.log("Employee added successfully!");
        start();
      }
    );
  });
};

function updateRole() {
  connection.query("SELECT id, first_name, last_name FROM employee;", function (err, res) {
    const empArr = [];
    for (let i = 0; i < res.length; i++) {
      const employee = res[i];
      const employeeName = `${employee.first_name} ${employee.last_name}`;
      const employeeData = {name: employeeName, value: employee.id}
      empArr.push(employeeData);
    }

  inquirer
  .prompt([
    {
      name: "name",
      type: "list",
      message: "Which employee's role would you like to update?",
      choices: empArr
    },
    {
      name: "role",
      type: "list",
      message: "Which new role will this employee receive?",
      choices: [
        "Sales Lead",
        "Salesperson",
        "Lead Engineer",
        "Software Engineer",
        "Accountant",
        "Legal Team Lead",
        "Lawyer"
    ]}
  ])
  .then(function(answer) {
    answer.role = answer.role.toLowerCase();
    if (answer.role === "sales lead") {
      answer.role = 1;
    } else if (answer.role === "salesperson") {
      answer.role = 2;
    } else if (answer.role === "lead engineer") {
      answer.role = 3;
    } else if (answer.role === "software engineer") {
      answer.role = 4;
    } else if (answer.role === "accountant") {
      answer.role = 5;
    } else if (answer.role === "legal team lead") {
      answer.role = 6;
    } else if (answer.role === "lawyer") {
      answer.role = 7;
    };

    connection.query(
      `UPDATE employee SET role_id = ${answer.role} WHERE id = ${answer.name};`,
      function(err) {
        if (err) throw err;
        console.log("Employee role updated successfully!");
        start();
      }
    );
  });
});
};

function delDept() {
  connection.query("SELECT * FROM department;", function(err, res) {
    if (err) throw err;
    console.table(res);
    // });
    inquirer.prompt([
      {
        name: "deptID",
        type: "input",
        message: "Input the ID of the department that you would like to delete. "
      },
    ])
    .then(function(answer) {
      connection.query(
        `DELETE FROM department WHERE id = ${parseInt(answer.deptID)}`, 
        function(err) {
          if (err) throw err;
          console.log("Department deleted successfully!");
          start();
        }
      );
    });
  });
}

function delRole() {
  connection.query("SELECT * FROM role;", function(err, res) {
    if (err) throw err;
    console.table(res);
    // });
    inquirer.prompt([
      {
        name: "roleID",
        type: "input",
        message: "Input the ID of the role that you would like to delete. "
      },
    ])
    .then(function(answer) {
      connection.query(
        `DELETE FROM role WHERE id = ${parseInt(answer.roleID)}`, 
        function(err) {
          if (err) throw err;
          console.log("Role deleted successfully!");
          start();
        }
      );
    });
  });
}

function delEmploy() {
  connection.query("SELECT * FROM employee;", function(err, res) {
    if (err) throw err;
    console.table(res);
    // });
    inquirer.prompt([
      {
        name: "empID",
        type: "input",
        message: "Input the ID of the employee that you would like to delete. "
      },
    ])
    .then(function(answer) {
      connection.query(
        `DELETE FROM employee WHERE id = ${parseInt(answer.empID)}`, 
        function(err) {
          if (err) throw err;
          console.log("Employee deleted successfully!");
          start();
        }
      );
    });
  });
}