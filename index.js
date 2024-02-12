#! /usr/bin/env node

// Importation de l'objet "program" de la bibliothèque "commander"
import { program } from "commander";

// Importation des commandes définies dans les fichiers respectifs
import { listProjectsCommand } from "./commands/list.js";
import { openProjectsCommand } from "./commands/open.js";
import { configurePathCommand } from "./commands/config.js";

// Ajout des commandes à l'objet "program"
program.addCommand(listProjectsCommand());
program.addCommand(openProjectsCommand());
program.addCommand(configurePathCommand());

// Analyse des arguments de ligne de commande
program.parse();
