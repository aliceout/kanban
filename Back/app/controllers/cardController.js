// Importation des modules nécessaires
const { List, Card } = require("../models");

// Contrôleur de cartes
const cardController = {
  // Récupérer toutes les cartes dans une liste
  getCardsInList: async (req, res) => {
    try {
      // Récupérer l'ID de la liste à partir des paramètres de la requête
      const listId = req.params.id;

      // Rechercher toutes les cartes dans la liste spécifiée, triées par position
      const cards = await Card.findAll({
        where: {
          list_id: listId,
        },
        include: "tags", // Inclure les tags associés aux cartes
        order: [["position", "ASC"]],
      });

      // Si aucune carte n'est trouvée, renvoyer une réponse JSON avec un statut 404
      if (!cards) {
        res
          .status(404)
          .json("Impossible de trouver des cartes avec list_id " + listId);
      } else {
        // Sinon, renvoyer les cartes en réponse
        res.json(cards);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Récupérer une seule carte par son ID
  getOneCard: async (req, res) => {
    try {
      // Récupérer l'ID de la carte à partir des paramètres de la requête
      const cardId = req.params.id;

      // Rechercher la carte par son ID, y compris les tags associés, triée par position
      const card = await Card.findByPk(cardId, {
        include: "tags",
        order: [["position", "ASC"]],
      });

      // Si la carte n'est pas trouvée, renvoyer une réponse JSON avec un statut 404
      if (!card) {
        res
          .status(404)
          .json("Impossible de trouver la carte avec l'ID " + cardId);
      } else {
        // Sinon, renvoyer la carte en réponse
        res.json(card);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Créer une nouvelle carte
  createCard: async (req, res) => {
    try {
      // Extraire les données de la carte (contenu, couleur, ID de la liste) à partir du corps de la requête
      const { content, color, list_id } = req.body;

      // Vérifier s'il y a des erreurs dans le corps de la requête
      let bodyErrors = [];
      if (!content) {
        bodyErrors.push(`Le contenu ne peut pas être vide`);
      }
      if (!list_id) {
        bodyErrors.push(`L'ID de la liste ne peut pas être vide`);
      }

      // Si des erreurs sont présentes, renvoyer une réponse JSON avec un statut 400
      if (bodyErrors.length) {
        res.status(400).json(bodyErrors);
      } else {
        // Sinon, créer une nouvelle carte, l'associer à la liste, et la sauvegarder dans la base de données
        let newCard = Card.build({ content, list_id });
        if (color) {
          newCard.color = color;
        }
        await newCard.save();
        // Renvoyer la nouvelle carte en réponse
        res.json(newCard);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Modifier une carte existante
  modifyCard: async (req, res) => {
    try {
      // Récupérer l'ID de la carte à partir des paramètres de la requête et les données de mise à jour à partir du corps de la requête
      const cardId = req.params.id;
      const { content, color, list_id, position } = req.body;

      // Inclure les tags pour pouvoir les renvoyer à la fin de la mise à jour
      let card = await Card.findByPk(cardId, {
        include: ["tags"],
      });

      // Si la carte n'est pas trouvée, renvoyer une réponse JSON avec un statut 404
      if (!card) {
        res
          .status(404)
          .json(`Impossible de trouver la carte avec l'ID ${cardId}`);
      } else {
        // Mettre à jour les propriétés de la carte avec les nouvelles données et la sauvegarder
        if (content) {
          card.content = content;
        }
        if (list_id) {
          card.list_id = list_id;
        }
        if (color) {
          card.color = color;
        }
        if (position) {
          card.position = position;
        }
        await card.save();
        // Renvoyer la carte mise à jour en réponse
        res.json(card);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Créer une nouvelle carte ou modifier une carte existante en fonction de la présence d'un ID
  createOrModify: async (req, res) => {
    try {
      let card;
      if (req.params.id) {
        card = await Card.findByPk(req.params.id);
      }
      if (card) {
        // Si la carte existe, appeler la fonction modifyCard
        await cardController.modifyCard(req, res);
      } else {
        // Sinon, appeler la fonction createCard
        await cardController.createCard(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  // Supprimer une carte existante
  deleteCard: async (req, res) => {
    try {
      // Récupérer l'ID de la carte à partir des paramètres de la requête
      const cardId = req.params.id;
      let card = await Card.findByPk(cardId);

      // Si la carte n'est pas trouvée, renvoyer une réponse JSON avec un statut 404
      if (!card) {
        res
          .status(404)
          .json(`Impossible de trouver la carte avec l'ID ${cardId}`);
      } else {
        // Supprimer la carte de la base de données
        await card.destroy();
        // Renvoyer une réponse 'ok'
        res.json("ok");
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
};

// Exporter l'objet cardController pour être utilisé ailleurs
module.exports = cardController;
