// Importing necessary libraries and modules
import chalk from "chalk";  // For console coloring
import conf from "conf";    // For configuration management
import fs from "fs";        // For file system operations
import inquirer from "inquirer";  // For user prompts
import { createSpinner } from "nanospinner";  // For creating a spinner
import { exec } from "child_process";  // For executing shell commands

// Creating a configuration instance for the project
export const config = new conf({ projectName: "GitOpener", projectVersion: "1.0.0" });

// Function to get the list of projects in the configured path
export function getProjects() {
    // Retrieving the path from the configuration
    let path = config.get("projectPath");

    // Reading the directory contents and sorting the projects
    const projects = fs.readdirSync(path).sort((a, b) => {
        return ("" + a).localeCompare(b);
    });

    return projects;
}

// Function to introduce a delay using a promise
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to configure the path for projects
export function configurePath(chemin) {
    if(chemin) {
        // Checking if the provided path exists
        if (fs.existsSync(chemin)) {
            // Setting the project path in the configuration
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

// Function to get the currently configured path
export function getConfiguredPath() {
    return config.get("projectPath");
}

// Function to execute a shell command and provide a callback
export function executeCommand(command, callback) {
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

// Function to prompt the user with specified questions
export function promptUser(questions) {
    return inquirer.prompt(questions);
}

// Function to create a spinner with a specified message
export function createSpinnerMessage(message) {
    return createSpinner(message);
}

// Function to exit the process with a specified exit code
export function exitProcess(code) {
    process.exit(code);
}
