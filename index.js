#! /usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import conf from "conf";
import fs from "fs";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { exec } from "child_process";

const config = new conf({ projectName: "GitOpener", projectVersion: "1.0.0" });
//config.set("projectPath", "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function list() {
    let path = config.get("projectPath");

    const projects = fs.readdirSync(path).sort((a, b) => {
        return ("" + a).localeCompare(b);
    });

    return projects;
}

program
    .command("list")
    .description("List all the notes")
    .action(async () => {
        if (config.get("projectPath") === "") {
            console.log(chalk.red("You need to set the path of your projects first"));
            console.log(chalk.red("Use the command gitopener config <path> to set the path"));
            return;
        } else {
            let sortedProjects = list();

            sortedProjects.forEach((project, index) => {
                console.log(`${chalk.dim(index + 1 + ".")} ${project}`);
            });
        }
    });

program
    .command("open")
    .description("Open a project")
    .action(async () => {
        if (config.get("projectPath") === "") {
            console.log(chalk.red("You need to set the path of your projects first"));
            console.log(chalk.red("Use the command gitopener config <path> to set the path"));
            return;
        } else {
            let projects = list();
            const selectedProject = await inquirer.prompt({
                name: "projects",
                type: "checkbox",
                message: "Selectionnez des projets a ouvrir dans Visual Studio Code",
                choices: projects,
            });

            if (selectedProject.projects.length === 0) {
                console.log(chalk.red("Vous devez selectionner au moins un projet"));
                return;
            } else {
                const spinner = createSpinner("Ouverture de Visual Studio Code...").start();
                await sleep(2000);
                let path = config.get("projectPath");

                selectedProject.projects.forEach((project, index) => {
                    exec(`code "${path + "\\" + project}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Erreur lors de l'ouverture de Visual Studio Code: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.error(`Erreur lors de l'ouverture de Visual Studio Code: ${stderr}`);
                            return;
                        }
                    });

                    if (index === selectedProject.projects.length - 1) {
                        spinner.success({ text: "Visual Studio Code ouvert !" });
                    }
                });

                await sleep(2000);

                process.exit(0);
            }
        }
    });

program
    .command("config")
    .argument("<path>", "Set the path of your projects")
    .description("")
    .action(async (path) => {
        if (fs.existsSync(path)) {
            config.set("projectPath", path);
            console.log(chalk.green("The path has been set to " + path));
        } else {
            console.log(chalk.red("The path is not valid"));
        }
    });

program.parse();
