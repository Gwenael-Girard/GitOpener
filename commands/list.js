// Importation de la classe Command de la bibliothèque "commander"
import { Command } from "commander";

// Importation des bibliothèques supplémentaires nécessaires
import chalk from "chalk"; // Pour la coloration de la console

// Importation de fonctions utilitaires depuis le fichier utils.js
import { getProjects, getConfiguredPath } from "../utils.js";

// Fonction qui crée et configure la commande "list" pour lister tous les projets
export function listProjectsCommand() {
    // Création d'une nouvelle instance de la classe Command avec le nom "list"
    const listCommand = new Command("list")
        .description("Liste tous les projets")

        // Fonction action qui sera appelée lors de l'exécution de la commande
        .action(() => {
            // Appel de la fonction listProjects pour afficher la liste des projets
            listProjects();
        });

    // Retourne l'instance de la commande configurée
    return listCommand;
}

// Fonction interne pour lister les projets
function listProjects() {
    // Récupération du chemin configuré depuis le fichier utils.js
    const path = getConfiguredPath();

    // Vérification si le chemin est défini
    if (!path) {
        console.log(chalk.red("Vous devez définir le chemin de vos projets d'abord"));
        console.log(chalk.red("Utilisez la commande gitopener config <chemin> pour définir le chemin"));
        return;
    }

    // Récupération et tri des projets depuis le fichier utils.js
    const sortedProjects = getProjects();

    // Affichage des projets avec leur index
    sortedProjects.forEach((project, index) => {
        console.log(`${chalk.dim(index + 1 + ".")} ${project}`);
    });
}
