const orderId = getOrderId()
displayOrderId(orderId)
deleteAllCach()

// Récupération de l'id de la commande //
function getOrderId() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get("orderId")
}

// Afficher l'id de la commande //
function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId
}

// Supprimer tous le cache //
function deleteAllCach() {
    const cache = window.localStorage
    cache.clear()
}