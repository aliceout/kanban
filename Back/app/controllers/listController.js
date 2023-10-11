// Importation du modèle List depuis le fichier '../models/list'
const List = require("../models/list");

// Contrôleur de listes
const listController = {
  // Récupérer toutes les listes avec leurs cartes associées
  getAllLists: async (req, res) => {
    try {
      // Rechercher toutes les listes, incluant les cartes et leurs tags associés, triées par position de liste puis position de carte
      const lists = await List.findAll({
        include: {
          association: "cards", // Inclure les cartes associées
          include: "tags", // Inclure les tags des cartes
        },
        order: [
          ["position", "ASC"], // Tri par position de liste
          ["cards", "position", "ASC"], // Tri par position de carte dans la liste
        ],
      });
      // Renvoyer la liste des listes en réponse
      res.json(lists);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  // Récupérer une liste spécifique avec ses cartes associées
  getOneList: async (req, res) => {
    try {
      // Récupérer l'ID de la liste depuis les paramètres de la requête
      const listId = req.params.id;
      // Rechercher la liste par son ID, incluant les cartes et leurs tags associés, triées par position de carte dans la liste
      const list = await List.findByPk(listId, {
        include: {
          association: "cards", // Inclure les cartes associées
          include: "tags", // Inclure les tags des cartes
        },
        order: [
          ["cards", "position", "ASC"], // Tri par position de carte dans la liste
        ],
      });
      if (list) {
        // Si la liste est trouvée, la renvoyer en réponse
        res.json(list);
      } else {
        // Sinon, renvoyer une réponse JSON avec un statut 404
        res
          .status(404)
          .json("Impossible de trouver la liste avec l'ID " + listId);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  // Créer une nouvelle liste
  createList: async (req, res) => {
    try {
      // Extraire les données de la liste (nom, position) à partir du corps de la requête
      const { name, position } = req.body;
      // Vérifier la présence des paramètres nécessaires
      const bodyErrors = [];
      if (!name) {
        bodyErrors.push("Le nom ne peut pas être vide");
      }

      if (bodyErrors.length) {
        // Si des erreurs sont présentes, renvoyer une réponse JSON avec un statut 400
        res.status(400).json(bodyErrors);
      } else {
        // Sinon, créer une nouvelle liste, l'associer à la position spécifiée, et la sauvegarder
        let newList = List.build({
          name,
          position,
        });
        await newList.save();
        // Renvoyer la nouvelle liste en réponse
        res.json(newList);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  // Modifier une liste existante
  modifyList: async (req, res) => {
    try {
      // Récupérer l'ID de la liste depuis les paramètres de la requête
      const listId = req.params.id;
      // Rechercher la liste par son ID
      const list = await List.findByPk(listId);
      if (!list) {
        // Si la liste n'est pas trouvée, renvoyer une réponse JSON avec un statut 404
        res
          .status(404)
          .send("Impossible de trouver la liste avec l'ID " + listId);
      } else {
        // Si la liste est trouvée, extraire les données de mise à jour (nom, position) à partir du corps de la requête
        const { name, position } = req.body;
        // Mettre à jour la liste avec les nouvelles données
        if (name) {
          list.name = name;
        }
        if (position) {
          list.position = position;
        }
        // Sauvegarder les modifications
        await list.save();
        // Renvoyer la liste modifiée en réponse
        res.json(list);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  // Créer une nouvelle liste ou modifier une liste existante en fonction de la présence d'un ID
  createOrModify: async (req, res) => {
    try {
      let list;
      if (req.params.id) {
        // Si l'ID est présent dans les paramètres de la requête, rechercher la liste par son ID
        list = await List.findByPk(req.params.id);
      }
      if (list) {
        // Si la liste existe, appeler la fonction modifyList pour la mettre à jour
        await listController.modifyList(req, res);
      } else {
        // Sinon, appeler la fonction createList pour créer une nouvelle liste
        await listController.createList(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  // Supprimer une liste existante
  deleteList: async (req, res) => {
    try {
      // Récupérer l'ID de la liste depuis les paramètres de la requête
      const listId = req.params.id;
      // Rechercher la liste par son ID
      const list = await List.findByPk(listId);
      // Supprimer la liste de la base de données
      await list.destroy();
      // Renvoyer une réponse 'OK'
      res.json("OK");
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },
};

// Exporter l'objet listController pour être utilisé ailleurs
module.exports = listController;
