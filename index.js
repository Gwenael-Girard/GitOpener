import { program } from "commander";
import { listProjectsCommand } from "./commands/list.js";
import { openProjectsCommand } from "./commands/open.js";
import { configurePathCommand } from "./commands/config.js";
import { cloneCommand } from "./commands/clone.js";

import figlet from "figlet";
import chalk from "chalk";

// Adding commands to the "program" object
program.addCommand(listProjectsCommand());
program.addCommand(openProjectsCommand());
program.addCommand(configurePathCommand());
program.addCommand(cloneCommand());

// Setting a global description for your program
program.description(
    figlet.textSync("GitOpener", {
        font: "Big",
        whitespaceBreak: false,
    }) 
    + '\n'
    + 'A tool for efficiently opening your Git projects.\n'
    + '-------------------------------------------------\n'
    + '                                ' + chalk.dim("By Gwenaël Girard") + '\n'
);

// Parsing command line arguments
program.parse();
