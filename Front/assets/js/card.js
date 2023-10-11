const card = {
    makeInDom(card_id, list_id, content, color, tags) {
        // Récupération du template kanban-card
        const template = document.getElementById("kanban-card");
        // Création d'une nouvelle tâche via le template (attention newCard est un document-fragment et pas un élément html).
        const newCard = document.importNode(template.content, true);
        // On ajoute le contenu
        const newCardValue = newCard.querySelector(".kanban-card-value");
        newCardValue.textContent = content;
        // On change la valeur de data-card-id avec l'id correspondant.
        const newCardContainer = newCard.querySelector("div");
        newCardContainer.setAttribute("data-card-id", card_id);
        // On ajoute le tag
        const tagContainer = newCard.querySelector(".column.is-narrow");
        tags.forEach(({ name, color }) => {
            const newTag = document.createElement("span");
            newTag.classList.add("tag");
            newTag.textContent = name;
            newTag.style.backgroundColor = color;
            newTag.style.color = "white";
            newTag.addEventListener("dblclick", () => console.log("Remove tag"));
            tagContainer.prepend(newTag);
        });
        // Ajoute la nouvelle tâche sur le DOM dans la bonne liste
        const currentList = document.querySelector(`[data-list-id="${list_id}"]`);
        const currentListContainer = currentList.querySelector(".panel-block.is-block.has-background-light")
        currentListContainer.appendChild(newCard);
        // Ajout de l'event listener (sur l'icone de stylo) pour modifier une carte.
        const currentCard = document.querySelector(`[data-card-id="${card_id}"]`)
        const pen = currentCard.querySelector(".icon.is-small.has-text-primary");
        pen.addEventListener("click", () => card.showUpdateForm(card_id));
        // Ajout d'un listener pour le submit de ce formulaire.
        const newCardForm = currentCard.querySelector("form");
        newCardForm.addEventListener("submit", event => card.handleUpdateForm(event, card_id));
        // Ajout d'un listener pour supprimer une carte.
        const trash = currentCard.querySelector(".icon.is-small.has-text-danger")
        trash.addEventListener("click", () => card.handleDelete(card_id));
    },
    updateInDom(id, content) {
        const currentCard = document.querySelector(`[data-card-id="${id}"]`);
        const contentContainer = currentCard.querySelector(".kanban-card-value");
        contentContainer.textContent = content;
    },
    deleteInDom(id) {
        const currentCard = document.querySelector(`[data-card-id="${id}"]`);

        currentCard.remove();
    },
    showModal(event) {
        const modal = document.getElementById("addCardModal");
        modal.classList.add("is-active");
        const form = modal.querySelector("form");
        const currentList = event.target.closest('.panel');
        const currentListId = currentList.getAttribute('data-list-id');
        const listIdInput = form.querySelector('[name="list_id"');
        listIdInput.value = currentListId
    },
    hideModal() {
        const modal = document.getElementById("addCardModal");
        const form = document.querySelector("#addCardModal form");

        modal.classList.remove("is-active");
        form.reset();
    },
    async handleCreateForm(event) {
        event.preventDefault();
        const form = document.querySelector("#addCardModal form");
        const formData = new FormData(form);
        // Je donne en paramètre les données de mon formulaire via formData.
        const newCard = await utils.createCard(formData);

        card.makeInDom(newCard.id, newCard.list_id, newCard.content)
        card.hideModal();
        // Dans mon élément form, j'ai une méthode reset qui permet de réinitialiser tous les inputs du formulaire.
        form.reset();
    },
    showUpdateForm(id) {
        const currentCard = document.querySelector(`[data-card-id="${id}"]`);
        const content = currentCard.querySelector(".kanban-card-value");
        const form = currentCard.querySelector("form");
        content.classList.add("is-hidden");
        form.classList.remove("is-hidden");
    },
    hiddenUpdateForm(id) {
        const currentCard = document.querySelector(`[data-card-id="${id}"]`);
        const content = currentCard.querySelector(".kanban-card-value");
        const form = currentCard.querySelector("form");
        content.classList.remove("is-hidden");
        form.classList.add("is-hidden");
    },
    async handleUpdateForm(event, id) {
        event.preventDefault();
        const currentCard = document.querySelector(`[data-card-id="${id}"]`);
        const form = currentCard.querySelector("form");
        const formData = new FormData(form);
        // Quand on valide notre formulaire, on veut que la modification se fasse côté serveur (dans la BDD).
        const newContent = await utils.modifyCard(formData, id);

        card.updateInDom(id, newContent);
        // Dans tous les cas, changement ou non, je re-affiche mon titre <h2>.
        card.hiddenUpdateForm(id);
    },
    handleDelete(id) {
        utils.deleteCard(id);
        card.deleteInDom(id);
    },
    setDragNDrop(id) {
        const currentList = document.querySelector(`[data-list-id="${id}"]`);
        const cardsContainer = currentList.querySelector(".panel-block.is-block.has-background-light");

        Sortable.create(cardsContainer, {
            group: "cards",
            onEnd(event) {
                // Je vais chercher dans mon nouveau container (event.to) le parent (.parentNode)
                // Je récupère le listId de la liste dans laquelle a été déplacé la carte.
                const newListId = event.to.parentNode.dataset.listId;
                const cards = event.to.children;
                for(index=0; index<cards.length; index++) {
                    const cardId = cards[index].dataset.cardId
                    const formData = new FormData();
                    formData.set("position", index);
                    formData.set("list_id", newListId);
                    utils.modifyCard(formData, cardId);
                }
            }
        });
    }
}