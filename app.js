const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const teamMembers = [];

const teamQuestions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Choose type of team member to add",
        name: "memberChoice",
        choices: ["Manager", "Engineer", "Intern"]
      },
      {
        type: "input",
        message: "Enter Name:",
        name: "name"
      },
      {
        type: "input",
        message: "Enter ID:",
        name: "id"
      },
      {
        tpye: "input",
        message: "Enter Email:",
        name: "email"
      },
    ])
    .then((response) => {
      let members = {
        Manager: "Office Number:",
        Engineer: "GitHub:",
        Intern: "School:"
      };
      inquirer
        .prompt({
          type: "input",
          message: members[response.memberChoice],
          name: "member"
        })
        .then((res) => {
          let constructors = {
            Manager: Manager,
            Engineer: Engineer,
            Intern: Intern
          };
          const questions = constructors[response.memberChoice];
          let newMember = new questions(
            response.name,
            response.id,
            response.email,
            res.member
          );
          teamMembers.push(newMember);
          return;
        })
        .then(() => {
          inquirer
            .prompt({
              type: "confirm",
              message: "Would you like to add another member?",
              name: "confirm"
            })
            .then((response) => {
              if (response.confirm) {
                teamQuestions();
              } else {
                let html = render(teamMembers);
                fs.writeFile(outputPath, html, (err) => {
                  if (err) throw err;
                });
              }
            });
        });
    });
};
teamQuestions();