// Importation des modules nécessaires pour définir le modèle 'Tag'
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db"); // Importation de la configuration de la base de données

// Définition du modèle 'Tag' en tant que classe héritant de 'Model'
class Tag extends Model {}

// Initialisation du modèle 'Tag' avec ses attributs et options
Tag.init(
  {
    // Attribut 'name' de type TEXTE (TEXT)
    name: DataTypes.TEXT,

    // Attribut 'color' de type TEXTE (TEXT)
    color: DataTypes.TEXT,
  },
  {
    sequelize, // Utilisation de l'instance de Sequelize (passée en tant que configuration)
    tableName: "tag", // Nom de la table associée à ce modèle dans la base de données
  }
);

// Exportation du modèle 'Tag' pour qu'il puisse être utilisé ailleurs dans l'application
module.exports = Tag;
