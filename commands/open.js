// Importation de la classe Command de la bibliothèque "commander"
import { Command } from "commander";

// Importation des bibliothèques supplémentaires nécessaires
import chalk from "chalk"; // Pour la coloration de la console

// Importation de fonctions utilitaires depuis le fichier utils.js
import { getProjects, sleep, executeCommand, getConfiguredPath, promptUser, createSpinnerMessage } from "../utils.js";

// Fonction qui crée et configure la commande "open" pour ouvrir un projet
export function openProjectsCommand() {
    // Création d'une nouvelle instance de la classe Command avec le nom "open"
    const openCommand = new Command("open")
        .description("Ouvre un projet")

        // Fonction action qui sera appelée lors de l'exécution de la commande
        .action(() => {
            // Appel de la fonction openProjects pour ouvrir les projets
            openProjects();
        });

    // Retourne l'instance de la commande configurée
    return openCommand;
}

// Fonction asynchrone pour ouvrir les projets
async function openProjects() {
    // Récupération du chemin configuré depuis le fichier utils.js
    const path = getConfiguredPath();

    // Vérification si le chemin est défini
    if (!path) {
        console.log(chalk.red("Vous devez définir le chemin de vos projets d'abord"));
        console.log(chalk.red("Utilisez la commande gitopener config <chemin> pour définir le chemin"));
        return;
    }

    // Récupération de la liste des projets
    const projects = getProjects();

    // Demande à l'utilisateur de sélectionner des projets à ouvrir dans Visual Studio Code
    const selectedProjects = await promptUser({
        name: "projects",
        type: "checkbox",
        message: "Sélectionnez des projets à ouvrir dans Visual Studio Code",
        choices: projects,
    });

    // Vérification si au moins un projet a été sélectionné
    if (selectedProjects.projects.length === 0) {
        console.log(chalk.red("Vous devez sélectionner au moins un projet"));
        return;
    }

    // Création d'un spinner pour afficher un message de chargement
    const spinner = createSpinnerMessage("Ouverture de Visual Studio Code...").start();
    await sleep(2000);

    // Boucle sur les projets sélectionnés
    selectedProjects.projects.forEach(async (project, index) => {
        // Construction de la commande pour ouvrir le projet avec Visual Studio Code
        const command = `code "${path + "\\" + project}"`;

        // Exécution de la commande
        executeCommand(command, (error, stdout) => {
            if (error) {
                console.error(`Erreur lors de l'ouverture de Visual Studio Code : ${error}`);
            } else {
                console.log(`Projet ${project} ouvert avec succès.`);
            }
        });

        // Vérification si c'est le dernier projet, puis arrêt du spinner et sortie du processus
        if (index === selectedProjects.projects.length - 1) {
            spinner.success({ text: "Visual Studio Code ouvert !" });
            await sleep(2000);
            exitProcess(0);
        }
    });
}
