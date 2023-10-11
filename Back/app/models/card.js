// Importation des modules nécessaires pour définir le modèle 'Card'
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db"); // Importation de la configuration de la base de données

// Définition du modèle 'Card' en tant que classe héritant de 'Model'
class Card extends Model {}

// Initialisation du modèle 'Card' avec ses attributs et options
Card.init(
  {
    // Attribut 'content' de type TEXTE (TEXT)
    content: DataTypes.TEXT,

    // Attribut 'color' de type TEXTE (TEXT)
    color: DataTypes.TEXT,

    // Attribut 'position' de type ENTIER (INTEGER)
    position: DataTypes.INTEGER,
  },
  {
    sequelize, // Utilisation de l'instance de Sequelize (passée en tant que configuration)
    tableName: "card", // Nom de la table associée à ce modèle dans la base de données
  }
);

// Exportation du modèle 'Card' pour qu'il puisse être utilisé ailleurs dans l'application
module.exports = Card;
