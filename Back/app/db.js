// Importation du module Sequelize
const { Sequelize } = require("sequelize");

// Création d'une instance Sequelize en utilisant la chaîne de connexion depuis les variables d'environnement (process.env.PG_URL)
const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true, // Utilisation de la convention de nommage snake_case pour les colonnes
    createdAt: "created_at", // Nom de la colonne pour la date de création
    updatedAt: "updated_at", // Nom de la colonne pour la date de mise à jour
  },
  logging: false, // Désactivation des journaux de requêtes SQL (logging)
});

// Exportation de l'instance Sequelize configurée pour être utilisée dans d'autres parties de l'application
module.exports = sequelize;
