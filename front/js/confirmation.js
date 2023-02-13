// Récupération de l'id contenu dans l'url de lapage //

let url = new URLSearchParams(document.location.search);
let id = url.get("id");
const orderId = id;

// Affichage de l'id du produit //

const idConfirmation = document.querySelector("#orderId");
idConfirmation.innerHTML = `<span id="orderId">${orderId}</span>`;
  
// Nettoyage du local storage après validation de la commande //

localStorage.clear();