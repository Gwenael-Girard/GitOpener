// Importing the Command class from the "commander" library
import { Command } from "commander";

import { execSync, exec } from "child_process"; // For executing shell commands
import chalk from "chalk";

import utils from "../utils.js";

// Function that creates and configures the "config" command with the "-p" (or "--path") option
export function cloneCommand() {
    // Creating a new instance of the Command class with the name "open"
    const cloneCommand = new Command("clone")
        .description("Clon a distant repo") // Description of the command

        // Action function that will be called when the command is executed
        .action(() => {
            // Calling the openProjects function to open the projects
            clone();
        });

    // Returning the configured instance of the command
    return cloneCommand;
}

async function clone() {
    const fetchingSpinner = utils.createSpinnerMessage("Fetching repositories...").start();

    // Retrieving the current username
    let username = await getCurrentUsername().then((username) => {
        return username;
    });

    // Retrieving the list of repositories
    let reposList = await getReposList().then((reposList) => {
        fetchingSpinner.success({ text: "Repositories for " + username + " fetched !" });
        return reposList;
    });

    let filteredReposList = reposList.filter((repo) => {
        return utils.getProjects().indexOf(repo.repo) === -1;
    });

    let choices = filteredReposList.map((repo, index) => {
        return repo.repo;
    });

    // Asking the user to select repos to clone
    let selectedRepos = await askingReposToClone(choices).then((selectedRepos) => {
        return selectedRepos.repos;
    });

    // Checking if at least one repos has been selected
    if (selectedRepos.length === 0) {
        console.log(chalk.red("You must select at least one repo"));
        return;
    }

    // Looping through the selected projects
    for (const indexRepo in selectedRepos) {

        const cloningSpinner = utils.createSpinnerMessage(`Cloning ${username + "/" + selectedRepos[indexRepo]}...`).start();

        try {
            await cloneRepo(username, selectedRepos[indexRepo]);
            cloningSpinner.success({ text: `${username + "/" + selectedRepos[indexRepo]} cloned !` });
        } catch(error) {
            cloningSpinner.error({ text: `Error cloning ${username + "/" + selectedRepos[indexRepo]} !` });
        }
    }
}

function getCurrentUsername() {
    return new Promise((resolve, reject) => {
        exec("gh api user", (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
                reject(error.message);
            }

            if (stderr) {
                console.error(`Erreur de la commande : ${stderr}`);
                reject(stderr);
            }

            let username = JSON.parse(stdout).login;
            resolve(username);
        });
    });
}

function getReposList() {
    return new Promise((resolve, reject) => {
        exec("gh repo list", (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
                reject(error.message);
            }

            if (stderr) {
                console.error(`Erreur de la commande : ${stderr}`);
                reject(stderr);
            }

            let reposArray = stdout.split("\n");
            reposArray.pop();

            resolve(reposArray.map(parseRepositoryData));
        });
    });
}

function askingReposToClone(choices) {
    return new Promise((resolve, reject) => {
        const selectedRepos = utils.promptUser({
            name: "repos",
            type: "checkbox",
            message: "Select repos to clone",
            choices: choices,
        });

        resolve(selectedRepos);
    });
}

function cloneRepo(username, repoName) {
    return new Promise((resolve, reject) => {
        // Définir le périphérique null selon le système d'exploitation
        const nullDevice = process.platform === "win32" ? "NUL" : "/dev/null";

        // Exécuter la commande en supprimant la sortie de la console
        exec(
            `gh repo clone ${username}/${repoName} ${utils.getConfiguredPath() + "\\" + repoName} > ${nullDevice} 2>&1`,
            (error, stdout, stderr) => {
                if (error) {
                    reject(error.message);
                }

                if (stderr) {
                    reject(stderr);
                }

                resolve(true);
            }
        );
    });
}

function parseRepositoryData(repositoryString) {
    // Séparation des éléments en utilisant la tabulation (\t)
    const [fullName, description, visibility, updatedAt] = repositoryString.split("\t");

    // Extraction du nom du propriétaire et du nom du dépôt
    const [owner, repo] = fullName.split("/");

    // Retourner un objet avec les propriétés séparées
    return {
        owner,
        repo,
        description,
        visibility,
        updatedAt,
    };
}
