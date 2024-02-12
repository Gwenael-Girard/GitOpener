import { program } from "commander";
import { listProjectsCommand } from "./commands/list.js";
import { openProjectsCommand } from "./commands/open.js";
import { configurePathCommand } from "./commands/config.js";

import figlet from "figlet";
import chalkAnimation from "chalk-animation";

// Adding commands to the "program" object
program.addCommand(listProjectsCommand());
program.addCommand(openProjectsCommand());
program.addCommand(configurePathCommand());

// Setting a global description for your program
program.description(
    figlet.textSync("GitOpener", {
        font: "Big",
        whitespaceBreak: false,
    }) + "\nA tool for efficiently opening your Git projects.\n-------------------------------------------------"
);

// Parsing command line arguments
program.parse();
