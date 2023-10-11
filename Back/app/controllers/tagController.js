// Importation des modules Tag et Card depuis le fichier '../models'
const { Tag, Card } = require("../models");

// Contrôleur de tags
const tagController = {
  // Récupérer tous les tags
  getAllTags: async (req, res) => {
    try {
      // Rechercher tous les tags dans la base de données
      const tags = await Tag.findAll();
      // Renvoyer la liste des tags en réponse
      res.json(tags);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Créer un nouveau tag
  createTag: async (req, res) => {
    try {
      // Extraire les données du tag (nom, couleur) à partir du corps de la requête
      const { name, color } = req.body;
      // Vérifier la présence des données nécessaires
      let bodyErrors = [];
      if (!name) {
        bodyErrors.push("Le nom ne peut pas être vide");
      }
      if (!color) {
        bodyErrors.push("La couleur ne peut pas être vide");
      }

      if (bodyErrors.length) {
        // Si des erreurs sont présentes, renvoyer une réponse JSON avec un statut 400
        res.status(400).json(bodyErrors);
      } else {
        // Sinon, créer un nouveau tag, l'associer au nom et à la couleur, puis le sauvegarder
        let newTag = Tag.build({ name, color });
        await newTag.save();
        // Renvoyer le nouveau tag en réponse
        res.json(newTag);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Modifier un tag existant
  modifyTag: async (req, res) => {
    try {
      // Récupérer l'ID du tag depuis les paramètres de la requête et les données de mise à jour à partir du corps de la requête
      const tagId = req.params.id;
      const { name, color } = req.body;

      // Rechercher le tag par son ID
      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        // Si le tag n'est pas trouvé, renvoyer une réponse JSON avec un statut 404
        res.status(404).json("Impossible de trouver le tag avec l'ID " + tagId);
      } else {
        // Si le tag est trouvé, mettre à jour les propriétés du tag avec les nouvelles données
        if (name) {
          tag.name = name;
        }
        if (color) {
          tag.color = color;
        }
        // Sauvegarder les modifications
        await tag.save();
        // Renvoyer le tag modifié en réponse
        res.json(tag);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Créer un nouveau tag ou modifier un tag existant en fonction de la présence d'un ID
  createOrModify: async (req, res) => {
    try {
      let tag;
      if (req.params.id) {
        // Si l'ID est présent dans les paramètres de la requête, rechercher le tag par son ID
        tag = await Tag.findByPk(req.params.id);
      }
      if (tag) {
        // Si le tag existe, appeler la fonction modifyTag pour le mettre à jour
        await tagController.modifyTag(req, res);
      } else {
        // Sinon, appeler la fonction createTag pour créer un nouveau tag
        await tagController.createTag(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  // Supprimer un tag existant
  deleteTag: async (req, res) => {
    try {
      // Récupérer l'ID du tag depuis les paramètres de la requête
      const tagId = req.params.id;
      // Rechercher le tag par son ID
      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        // Si le tag n'est pas trouvé, renvoyer une réponse JSON avec un statut 404
        res.status(404).json("Impossible de trouver le tag avec l'ID " + tagId);
      } else {
        // Supprimer le tag de la base de données
        await tag.destroy();
        // Renvoyer une réponse 'OK'
        res.json("OK");
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  // Associer un tag à une carte
  associateTagToCard: async (req, res) => {
    try {
      // Récupérer l'ID de la carte depuis les paramètres de la requête et l'ID du tag à partir du corps de la requête
      const cardId = req.params.id;
      const tagId = req.body.tag_id;

      // Rechercher la carte par son ID, incluant les tags associés
      let card = await Card.findByPk(cardId, {
        include: ["tags"],
      });
      if (!card) {
        // Si la carte n'est pas trouvée, renvoyer une réponse JSON avec un statut 404
        return res
          .status(404)
          .json("Impossible de trouver la carte avec l'ID " + cardId);
      }

      // Rechercher le tag par son ID
      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        // Si le tag n'est pas trouvé, renvoyer une réponse JSON avec un statut 404
        return res
          .status(404)
          .json("Impossible de trouver le tag avec l'ID " + tagId);
      }

      // Associer le tag à la carte (utilisation de Sequelize)
      await card.addTag(tag);
      // Les associations de l'instance ne sont pas mises à jour, donc nous devons refaire un select
      card = await Card.findByPk(cardId, {
        include: ["tags"],
      });
      // Renvoyer la carte mise à jour en réponse
      res.json(card);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  // Supprimer un tag d'une carte
  removeTagFromCard: async (req, res) => {
    try {
      // Récupérer l'ID de la carte et l'ID du tag depuis les paramètres de la requête
      const { cardId, tagId } = req.params;

      // Rechercher la carte par son ID
      let card = await Card.findByPk(cardId);
      if (!card) {
        // Si la carte n'est pas trouvée, renvoyer une réponse JSON avec un statut 404
        return res
          .status(404)
          .json("Impossible de trouver la carte avec l'ID " + cardId);
      }

      // Rechercher le tag par son ID
      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        // Si le tag n'est pas trouvé, renvoyer une réponse JSON avec un statut 404
        return res
          .status(404)
          .json("Impossible de trouver le tag avec l'ID " + tagId);
      }

      // Dissocier le tag de la carte (utilisation de Sequelize)
      await card.removeTag(tag);

      // Refaire un select pour mettre à jour les associations de l'instance
      card = await Card.findByPk(cardId, {
        include: ["tags"],
      });

      // Renvoyer la carte mise à jour en réponse
      res.json(card);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
};

// Exporter l'objet tagController pour être utilisé ailleurs
module.exports = tagController;
