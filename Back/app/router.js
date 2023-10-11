// Importation du module Express
const express = require("express");

// Importation des contrôleurs
const listController = require("./controllers/listController");
const cardController = require("./controllers/cardController");
const tagController = require("./controllers/tagController");

// Création d'un routeur Express
const router = express.Router();

/** Routes pour les listes (Lists) */

// Récupérer toutes les listes
router.get("/lists", listController.getAllLists);

// Récupérer une liste par son ID
router.get("/lists/:id", listController.getOneList);

// Créer une nouvelle liste
router.post("/lists", listController.createList);

// Modifier une liste existante
router.patch("/lists/:id", listController.modifyList);

// Créer ou modifier une liste (selon si l'ID est fourni)
router.put("/lists/:id?", listController.createOrModify);

// Supprimer une liste par son ID
router.delete("/lists/:id", listController.deleteList);

/** Routes pour les cartes (Cards) */

// Récupérer les cartes d'une liste spécifique
router.get("/lists/:id/cards", cardController.getCardsInList);

// Récupérer une carte par son ID
router.get("/cards/:id", cardController.getOneCard);

// Créer une nouvelle carte
router.post("/cards", cardController.createCard);

// Modifier une carte existante
router.patch("/cards/:id", cardController.modifyCard);

// Créer ou modifier une carte (selon si l'ID est fourni)
router.put("/cards/:id?", cardController.createOrModify);

// Supprimer une carte par son ID
router.delete("/cards/:id", cardController.deleteCard);

/** Routes pour les étiquettes (Tags) */

// Récupérer toutes les étiquettes
router.get("/tags", tagController.getAllTags);

// Créer une nouvelle étiquette
router.post("/tags", tagController.createTag);

// Modifier une étiquette existante
router.patch("/tags/:id", tagController.modifyTag);

// Créer ou modifier une étiquette (selon si l'ID est fourni)
router.put("/tags/:id?", tagController.createOrModify);

// Supprimer une étiquette par son ID
router.delete("/tags/:id", tagController.deleteTag);

// Associer une étiquette à une carte
router.post("/cards/:id/tags", tagController.associateTagToCard);

// Dissocier une étiquette d'une carte
router.delete("/cards/:cardId/tags/:tagId", tagController.removeTagFromCard);

// Gestion des erreurs : Si aucune route correspondante n'est trouvée, renvoyer une réponse 404
router.use((req, res) => {
  res
    .status(404)
    .send("Service does not exist\nSee: https://doc.localhost.api");
});

// Exportation du routeur Express pour être utilisé dans l'application principale
module.exports = router;
