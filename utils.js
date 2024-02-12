import chalk from "chalk";
import conf from "conf";
import fs from "fs";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { exec } from "child_process";

export const config = new conf({ projectName: "GitOpener", projectVersion: "1.0.0" });

export function getProjects() {
    let path = config.get("projectPath");

    const projects = fs.readdirSync(path).sort((a, b) => {
        return ("" + a).localeCompare(b);
    });

    return projects;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function configurePath(chemin) {
    if(chemin) {
        if (fs.existsSync(chemin)) {
            config.set("projectPath", chemin);
            console.log(chalk.green("Le chemin a été défini à " + chemin));
            console.log("Chemin actuel : " + chalk.blue(getConfiguredPath()))
        } else {
            console.log(chalk.red("Le chemin n'est pas valide"));
            console.log("Chemin actuel : " + chalk.blue(getConfiguredPath()))
        }
    } else {
        console.log("Chemin actuel : " + chalk.blue(getConfiguredPath()))
    }
}

export function getConfiguredPath() {
    return config.get("projectPath");
}

export function executeCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
            callback(error.message, null);
        } else if (stderr) {
            console.error(`Erreur lors de l'exécution de la commande : ${stderr}`);
            callback(stderr, null);
        } else {
            callback(null, stdout);
        }
    });
}

export function promptUser(questions) {
    return inquirer.prompt(questions);
}

export function createSpinnerMessage(message) {
    return createSpinner(message);
}

export function exitProcess(code) {
    process.exit(code);
}
