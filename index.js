#! /usr/bin/env node

// Importing the "program" object from the "commander" library
import { program } from "commander";

// Importing commands defined in respective files
import { listProjectsCommand } from "./commands/list.js";
import { openProjectsCommand } from "./commands/open.js";
import { configurePathCommand } from "./commands/config.js";

// Adding commands to the "program" object
program.addCommand(listProjectsCommand());
program.addCommand(openProjectsCommand());
program.addCommand(configurePathCommand());

// Parsing command line arguments
program.parse();
