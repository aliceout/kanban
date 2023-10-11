// on objet qui contient des fonctions
const app = {
    // fonction d'initialisation, lancée au chargement de la page
    init() {
        console.log('app.init !');
        app.addListenerToActions();
        list.loadAllLists();
    },
    addListenerToActions() {
        // Bouton: Ajouter une liste
        const openModalButton = document.getElementById('addListButton');
        openModalButton.addEventListener("click", list.showModal);
        // Boutons: Fermer la modale pour ajouter une liste
        const closeModalButtons = document.querySelectorAll("#addListModal .close");
        const addEventListener = element => {
            element.addEventListener('click', list.hideModal);
        };
        closeModalButtons.forEach(addEventListener);
        // Formulaire: Ajouter une liste
        const addListForm = document.querySelector("#addListModal form");
        addListForm.addEventListener("submit", list.handleCreateForm)
        // Boutons croix: Ouvrir card modal
        const openCardModalButton = document.querySelectorAll(".is-pulled-right");
        openCardModalButton.forEach(element => {
            element.addEventListener('click', card.showModal);
        });
        // Boutons: Fermer la modale pour ajouter une tâche
        const closeCardModalButtons = document.querySelectorAll("#addCardModal .close");
        closeCardModalButtons.forEach(element => {
            element.addEventListener('click', card.hideModal);
        });
        // Formulaire: Ajouter une tâche
        const addCardForm = document.querySelector("#addCardModal form");
        addCardForm.addEventListener("submit", card.handleCreateForm)
    },
};

// On accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init.
document.addEventListener('DOMContentLoaded', app.init);