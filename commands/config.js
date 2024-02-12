// Importation de la classe Command de la bibliothèque "commander"
import { Command } from "commander";

// Importation de la fonction configurePath depuis le fichier utils.js
import { configurePath } from "../utils.js";

// Fonction qui crée et configure la commande "config" avec l'option "-p" (ou "--path")
export function configurePathCommand() {
    // Création d'une nouvelle instance de la classe Command avec le nom "config"
    const configCommand = new Command("config")
        .description("[REMPLACE MOI]") // Description de la commande (remplacez par votre description réelle)

        // Ajout de l'option "-p" (ou "--path") à la commande avec une description
        .option("-p, --path <path>", "Spécifier le chemin d'accès au dossier contenant les projets")

        // Fonction action qui sera appelée lors de l'exécution de la commande
        .action((cmd) => {
            // Appel de la fonction configurePath avec le chemin d'accès spécifié
            configurePath(cmd.path);
        });

    // Retourne l'instance de la commande configurée
    return configCommand;
}
