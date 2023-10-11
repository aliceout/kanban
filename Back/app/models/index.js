// Importation des modèles Card, List et Tag
const Card = require("./card");
const List = require("./list");
const Tag = require("./tag");

/** Associations entre les modèles */

// Association "belongsToMany" entre Card et Tag
Card.belongsToMany(Tag, {
  as: "tags", // Alias pour l'association
  through: "card_has_tag", // Nom de la table de jonction
  foreignKey: "card_id", // Clé étrangère de Card dans la table de jonction
  otherKey: "tag_id", // Clé étrangère de Tag dans la table de jonction
  timestamps: false, // Désactivation des horodatages
});

// Association "belongsToMany" inverse entre Tag et Card
Tag.belongsToMany(Card, {
  as: "cards", // Alias pour l'association
  through: "card_has_tag", // Nom de la table de jonction
  foreignKey: "tag_id", // Clé étrangère de Tag dans la table de jonction
  otherKey: "card_id", // Clé étrangère de Card dans la table de jonction
  timestamps: false, // Désactivation des horodatages
});

// Association "hasMany" entre List et Card
List.hasMany(Card, {
  as: "cards", // Alias pour l'association
  foreignKey: "list_id", // Clé étrangère de Card liée à List
});

// Association "belongsTo" inverse entre Card et List
Card.belongsTo(List, {
  as: "list", // Alias pour l'association
  foreignKey: "list_id", // Clé étrangère de Card liée à List
});

// Exportation des modèles Card, List et Tag ainsi que de leurs associations
module.exports = { Card, List, Tag };
