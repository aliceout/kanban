// Importation des modules nécessaires pour définir le modèle 'List'
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db"); // Importation de la configuration de la base de données

// Définition du modèle 'List' en tant que classe héritant de 'Model'
class List extends Model {}

// Initialisation du modèle 'List' avec ses attributs et options
List.init(
  {
    // Attribut 'name' de type TEXTE (TEXT)
    name: DataTypes.TEXT,

    // Attribut 'position' de type ENTIER (INTEGER)
    position: DataTypes.INTEGER,
  },
  {
    sequelize, // Utilisation de l'instance de Sequelize (passée en tant que configuration)
    tableName: "list", // Nom de la table associée à ce modèle dans la base de données
  }
);

// Exportation du modèle 'List' pour qu'il puisse être utilisé ailleurs dans l'application
module.exports = List;
