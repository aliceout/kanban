const list = {
    async loadAllLists() {
        // Je demande à mon API toutes les listes dans la BDD.
        const lists = await utils.getLists();
        console.log(lists)
        // Je boucle sur le tableau de listes.
        // Dans mon forEach, j'utilise la destructuration, et je renomme "id" en "list_id".
        lists.forEach(({ id: list_id , name, cards }) => {
            // J'ajoute chaque liste dans le DOM, une à une.
            list.makeInDom(list_id, name);
            cards.forEach(({ id: card_id, content, color, tags }) => {
                // J'ajoute chaque carte de la liste dans le DOM, une à une.
                card.makeInDom(card_id, list_id, content, color, tags)
            })
        })
        // Une fois que j'ai chargé toutes mes listes, j'active le drag'n'drop.
        list.setDragNDrop();
    },
    makeInDom(id, name) {
        // Récupération du template kanban-list
        const template = document.getElementById("kanban-list");
        // Création d'une nouvelle liste via le template
        const newList = document.importNode(template.content, true);
        // On change le nom de la nouvelle liste avec le nom donné en paramètre
        const newListTitle = newList.querySelector(".list-title");
        newListTitle.textContent = name;
        // On change le data-list-id
        const newListId = newList.querySelector(".column.is-one-quarter.panel");
        newListId.setAttribute("data-list-id", id);
        // Je relie le nouveau listener
        const openCardModalButton = newList.querySelector(".is-pulled-right");
        openCardModalButton.addEventListener('click', card.showModal);
        // Ajoute la nouvelle liste sur le DOM
        const listsContainer = document.querySelector(".card-lists.columns");
        listsContainer.append(newList);
        // Ajout d'un listener pour afficher le formulaire de modification du nom de la liste lors d'un double clique sur le titre
        newListTitle.addEventListener("dblclick", () => list.showUpdateForm(id))
        // Ajout d'un listener pour le submit de ce formulaire
        const currentList = document.querySelector(`[data-list-id="${id}"]`);
        const newListForm = currentList.querySelector("form");
        newListForm.addEventListener("submit", event => list.handleUpdateForm(event, id))
        // Ajout d'un listener pour supprimer une liste.
        const trash = currentList.querySelector(".icon.is-small.has-text-danger")
        trash.addEventListener("click", () => list.handleDeleteForm(id));
        // On active le Drag'n'Drop pour les cartes contenues dans cette liste.
        card.setDragNDrop(id);
    },
    updateInDom(id, name) {
        const currentList = document.querySelector(`[data-list-id="${id}"]`);
        const title = currentList.querySelector(".list-title");
        title.textContent = name;
    },
    deleteInDom(id) {
        const currentList = document.querySelector(`[data-list-id="${id}"]`);

        currentList.remove();
    },
    // Gestion de la modal et de son formulaire pour créer une liste.
    showModal() {
        const modal = document.getElementById("addListModal");

        modal.classList.add("is-active");
    },
    hideModal() {
        const modal = document.getElementById("addListModal");
        const form = document.querySelector("#addListModal form");

        modal.classList.remove("is-active");
        form.reset();
    },
    async handleCreateForm(event) {
        event.preventDefault();
        const form = document.querySelector("#addListModal form");
        const formData = new FormData(form);
        const newList = await utils.createList(formData);
        
        list.makeInDom(newList.id, newList.name);
        list.hideModal();
        form.reset();
    },
    // Gestion du formulaire pour modifier le titre d'une liste.
    showUpdateForm(id) {
        const currentList = document.querySelector(`[data-list-id="${id}"]`);
        const title = currentList.querySelector(".list-title");
        const form = currentList.querySelector("form");
        title.classList.add("is-hidden");
        form.classList.remove("is-hidden");
    },
    hideUpdateForm(id) {
        const currentList = document.querySelector(`[data-list-id="${id}"]`);
        const title = currentList.querySelector(".list-title");
        const form = currentList.querySelector("form");
        title.classList.remove("is-hidden");
        form.classList.add("is-hidden");
    },
    async handleUpdateForm(event, id) {
        event.preventDefault();
        const currentList = document.querySelector(`[data-list-id="${id}"]`);
        const form = currentList.querySelector("form");
        const formData = new FormData(form);
        // Quand on valide notre formulaire, on veut que la modification se fasse côté serveur (dans la BDD).
        const name = await utils.modifyList(formData, id);
        list.updateInDom(id, name);
        // Dans tous les cas, changement ou non, je re-affiche mon titre <h2>.
        list.hideUpdateForm(id);
    },
    // Créer une pop-up pour demander la confirmation à l'utilisateur.
    async handleDeleteForm(id) {
        if (confirm("Êtes-vous sûr de vouloir supprimer la liste ?")) {
            utils.deleteList(id);
            list.deleteInDom(id);
        }
    },
    setDragNDrop() {
        // Je récupère l'élément qui contient toutes les listes.
        const listsContainer = document.querySelector(".card-lists.columns");

        // J'initialise le Drag'n'Drop sur le container récupéré.
        // Je peux donner des options en deuxième paramètre, sous forme d'un objet (les options sont données dans la documentation).
        Sortable.create(listsContainer, {
            // L'option onEnd permet de déclarer une fonction qui sera appelé lorsque un élément sera relaché.
            // La fonction reçoit l'objet event en paramètre.
            onUpdate(event) {
                // Dans l'objet event, je peux récupérer différentes informations, comme par exemple le container dans lequel la liste a été relaché (=> event.to).
                // Je récupère les children de cet élément dans un HTMLCollection (un tableau).
                const lists = event.to.children;
                // Je vais parcourir chacune de mes listes pour mettre à jour leurs positions respectives.
                for(index=0; index<lists.length; index++) {
                    // Pour un élément HTML, je peux me servir de la méthode dataset pour récupérer sous forme d'un objet, toutes les propriétés de cet élément qui commence par "data-".
                    const listId = lists[index].dataset.listId
                    // Je crée un nouveau formData pour pouvoir envoyer les données à ma fonction modifyList (puisqu'elle attend un formData).
                    const formData = new FormData();
                    // Je remplis mon formData avec la propriété position et pour valeur l'index.
                    formData.set("position", index);
                    utils.modifyList(formData, listId);
                }
            },
        });
    }
};
