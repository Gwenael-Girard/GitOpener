// utils.js

import chalk from "chalk";
import conf from "conf";
import fs from "fs";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { exec, execSync } from "child_process";

const config = new conf({ projectName: "GitOpener", projectVersion: "1.0.0" });

function getProjects() {
    let path = config.get("projectPath");
    const projects = fs.readdirSync(path).sort((a, b) => {
        return ("" + a).localeCompare(b);
    });
    return projects;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function configurePath(chemin) {
    if (chemin) {
        if (fs.existsSync(chemin)) {
            config.set("projectPath", chemin);
            console.log(chalk.green("The path has been set to " + chemin));
            console.log("Current path: " + chalk.blue(getConfiguredPath()));
        } else {
            console.log(chalk.red("The path is not valid"));
            console.log("Current path: " + chalk.blue(getConfiguredPath()));
        }
    } else {
        console.log("Current path: " + chalk.blue(getConfiguredPath()));
    }
}

function getConfiguredPath() {
    return config.get("projectPath");
}

function executeCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            callback(error.message, null);
        } else if (stderr) {
            console.error(`Error executing command: ${stderr}`);
            callback(stderr, null);
        } else {
            callback(null, stdout);
        }
    });
}

function promptUser(questions) {
    return inquirer.prompt(questions);
}

function createSpinnerMessage(message) {
    return createSpinner(message);
}

function exitProcess(code) {
    process.exit(code);
}

function isGitHubCLIAvailable() {
    try {
        execSync("gh --version");
        return true;
    } catch (error) {
        return false;
    }
}

function isUserLoggedIn() {
    try {
        execSync("gh auth status");
        return true;
    } catch (error) {
        return false;
    }
}

const utils = {
    getProjects,
    sleep,
    configurePath,
    getConfiguredPath,
    executeCommand,
    promptUser,
    createSpinnerMessage,
    exitProcess,
    isGitHubCLIAvailable,
    isUserLoggedIn,
};

export default utils;
