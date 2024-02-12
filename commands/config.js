// Importing the Command class from the "commander" library
import { Command } from "commander";

// Importing the configurePath function from the utils.js file
import { configurePath } from "../utils.js";

// Function that creates and configures the "config" command with the "-p" (or "--path") option
export function configurePathCommand() {
    // Creating a new instance of the Command class with the name "config"
    const configCommand = new Command("config")
        .description("Configure the path to the projects") // Description of the command (replace with your actual description)

        // Adding the "-p" (or "--path") option to the command with a description
        .option("-p, --path <path>", "Specify the path to the folder containing the projects")

        // Action function that will be called when the command is executed
        .action((cmd) => {
            // Calling the configurePath function with the specified path
            configurePath(cmd.path);
        });

    // Returning the configured instance of the command
    return configCommand;
}