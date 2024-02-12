// Importing the Command class from the "commander" library
import { Command } from "commander";

// Importing necessary additional libraries
import chalk from "chalk"; // For console coloring

// Importing utility functions from the utils.js file
import { getProjects, getConfiguredPath } from "../utils.js";

// Function that creates and configures the "list" command to list all projects
export function listProjectsCommand() {
    // Creating a new instance of the Command class with the name "list"
    const listCommand = new Command("list")
        .description("List all projects") // Description of the command

        // Action function that will be called when the command is executed
        .action(() => {
            // Calling the listProjects function to display the list of projects
            listProjects();
        });

    // Returning the configured instance of the command
    return listCommand;
}

// Internal function to list projects
function listProjects() {
    // Retrieving the configured path from the utils.js file
    const path = getConfiguredPath();

    // Checking if the path is defined
    if (!path) {
        console.log(chalk.red("You must set the path to your projects first"));
        console.log(chalk.red("Use the command gitopener config <path> to set the path"));
        return;
    }

    // Retrieving and sorting projects from the utils.js file
    const sortedProjects = getProjects();

    // Displaying the projects with their index
    sortedProjects.forEach((project, index) => {
        console.log(`${chalk.dim(index + 1 + ".")} ${project}`);
    });
}
