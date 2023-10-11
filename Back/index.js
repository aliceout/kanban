// Importation des modules nécessaires
const dotenv = require("dotenv");
dotenv.config(); // Configuration des variables d'environnement

const express = require("express");
const router = require("./app/router");
const cors = require("cors");
const multer = require("multer");

// Définition du port d'écoute (utilisation de la valeur par défaut 5050 si PORT n'est pas défini dans les variables d'environnement)
const PORT = process.env.PORT || 5050;

// Création d'une instance Express
const app = express();

// Activation de CORS pour permettre les requêtes depuis tous les domaines (à des fins de démonstration)
app.use(cors("*"));

// Configuration d'Express pour analyser les données de formulaire URL-encoded
app.use(express.urlencoded({ extended: true }));

// Configuration de Multer pour la gestion des données multipart/form-data
const mutipartParser = multer();
app.use(mutipartParser.none());

// Configuration d'Express pour servir des fichiers statiques à partir du répertoire "public"
app.use(express.static("public"));

// Importation du middleware de "nettoyage" des variables
const bodySanitizer = require("./app/middlewares/body-sanitizer");
app.use(bodySanitizer);

// Utilisation du routeur principal pour gérer les routes
app.use(router);

// Démarrage du serveur Express et écoute sur le port spécifié
app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...`);
});
