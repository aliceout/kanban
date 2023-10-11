// Dans utils: je met toutes les fonctions qui font des appels à des API.
// Je ne me charge pas du rendu sur la page.

const utils = {
  base_url: "http://localhost:3000",
  async getLists() {
    const response = await fetch(`${utils.base_url}/lists`);
    // Pour accéder aux datas dans la réponse, on utilise la méthode response.json.
    // Attention la méthode .json renvoit les datas sous forme d'une Promise, on utilise le await pour récupérer les datas.
    const lists = await response.json();

    return lists;
  },
  async createList(formData) {
    const request = {
      method: "POST",
      body: formData,
    };
    // Gestion des positions des listes.
    // Je récupère toutes mes listes pour pouvoir récupérer la position de ma dernière liste.
    const lists = await utils.getLists();
    if (lists.length !== 0) {
      const lastList = lists[lists.length - 1];
      const position = lastList.position + 1;
      // Je rajoute la position de la nouvelle liste dans le formData.
      formData.set("position", position);
    }
    // Pour faire une requête POST avec fetch, on ajoute request (= un object) en deuxième paramètre.
    const response = await fetch(`${utils.base_url}/lists`, request);
    // Je vérifie que la réponse est OK (200), car le serveur pourrait me renvoyer une réponse correcte, mais qui n'aurait pas fonctionné de son côté (400/500).
    // La propriété OK est rajouté automatiquement (se souvenir des prototypes).
    if (response.ok) {
      // Quand on fait une requête POST, le serveur nous renvoie l'élément créé dans la réponse.
      const newList = await response.json();

      return newList;
    }
  },
  async modifyList(formData, id) {
    // Pour modifier une valeur, on passe par la méthode: PATCH.
    // Contrairement à la méthode: PUT, qui remplace toutes les valeurs (même si elles sont identiques).
    // Les deux méthodes me renvoit le nouvel élément dans son ensemble.
    const request = {
      method: "PATCH",
      body: formData,
    };
    const response = await fetch(`${utils.base_url}/lists/${id}`, request);
    if (response.ok) {
      const { name } = await response.json();

      return name;
    }
  },
  async deleteList(id) {
    const request = {
      method: "DELETE",
    };
    const response = await fetch(`${utils.base_url}/lists/${id}`, request);
    if (response.ok) {
      return true;
    }
    return false;
  },
  async createCard(formData) {
    const request = {
      method: "POST",
      body: formData,
    };
    const response = await fetch(`${utils.base_url}/cards`, request);
    if (response.ok) {
      const newCard = await response.json();

      return newCard;
    }
  },
  async modifyCard(formData, id) {
    // Pour modifier une valeur, on passe par la méthode: PATCH.
    // Contrairement à la méthode: PUT, qui remplace toutes les valeurs (même si elles sont identiques).
    // Les deux méthodes me renvoit le nouvel élément dans son ensemble.
    const request = {
      method: "PATCH",
      body: formData,
    };
    const response = await fetch(`${utils.base_url}/cards/${id}`, request);
    if (response.ok) {
      const { content } = await response.json();

      return content;
    }
  },
  async deleteCard(id) {
    // Avec la méthode DELETE, le serveur doit supprimer l'élément côté BDD, et renvoie l'élément supprimé au front.
    const request = {
      method: "DELETE",
    };
    const response = await fetch(`${utils.base_url}/cards/${id}`, request);
    if (response.ok) {
      return true;
    }
    return false;
  },
};
