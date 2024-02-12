// Importing the Command class from the "commander" library
import { Command } from "commander";

// Importing necessary additional libraries
import chalk from "chalk"; // For console coloring

// Importing utility functions from the utils.js file
import { getProjects, sleep, executeCommand, getConfiguredPath, promptUser, createSpinnerMessage, exitProcess } from "../utils.js";

// Function that creates and configures the "open" command to open a project
export function openProjectsCommand() {
    // Creating a new instance of the Command class with the name "open"
    const openCommand = new Command("open")
        .description("Open a project") // Description of the command

        // Action function that will be called when the command is executed
        .action(() => {
            // Calling the openProjects function to open the projects
            openProjects();
        });

    // Returning the configured instance of the command
    return openCommand;
}

// Async function to open projects
async function openProjects() {
    // Retrieving the configured path from the utils.js file
    const path = getConfiguredPath();

    // Checking if the path is defined
    if (!path) {
        console.log(chalk.red("You must set the path to your projects first"));
        console.log(chalk.red("Use the command gitopener config <path> to set the path"));
        return;
    }

    // Retrieving the list of projects
    const projects = getProjects();

    // Asking the user to select projects to open in Visual Studio Code
    const selectedProjects = await promptUser({
        name: "projects",
        type: "checkbox",
        message: "Select projects to open in Visual Studio Code",
        choices: projects,
    });

    // Checking if at least one project has been selected
    if (selectedProjects.projects.length === 0) {
        console.log(chalk.red("You must select at least one project"));
        return;
    }

    // Creating a spinner to display a loading message
    const spinner = createSpinnerMessage("Opening Visual Studio Code...").start();
    await sleep(2000);

    // Looping through the selected projects
    selectedProjects.projects.forEach(async (project, index) => {
        // Constructing the command to open the project with Visual Studio Code
        const command = `code "${path + "\\" + project}"`;

        // Executing the command
        executeCommand(command, (error, stdout) => {
            if (error) {
                console.error(`Error opening Visual Studio Code: ${error}`);
            }
        });

        // Checking if it's the last project, then stopping the spinner and exiting the process
        if (index === selectedProjects.projects.length - 1) {
            spinner.success({ text: "Visual Studio Code opened!" });
            await sleep(2000);
            exitProcess(0);
        }
    });
}
