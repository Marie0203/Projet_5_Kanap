const cart = []

retrieveItemsFromCache()
cart.forEach(async (item) => {
  let produit = await getProductDetails(item.id)
  produit.quantity = item.quantity;
  produit.color = item.color;
  displayItem(produit)
})

// Récupération des éléments du local storage //
function retrieveItemsFromCache() {
  const numberOfItems = localStorage.length
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || ""
    const itemObject = JSON.parse(item)
    cart.push(itemObject)
  }
}

// Récupération des détails des produits //
function getProductDetails(id) {
  return fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
}

// Affichage des éléments //
function displayItem(item) {
  const article = addArticle(item)
  const imageDiv = addImageDiv(item)
  article.appendChild(imageDiv)
  const cartItemContent = addCartContent(item)
  article.appendChild(cartItemContent)
  displayArticle(article)
  displayTotalQuantity()
  displayTotalPrice()
}

// Div pour la description et ajout du "h2" et "p" //
function addDescription(item) {
  const description = document.createElement("div")
  description.classList.add("cart__item__content__description")

  const h2 = document.createElement("h2")
  h2.textContent = item.name
  const p = document.createElement("p")
  p.textContent = item.color
  const p2 = document.createElement("p")
  p2.textContent = item.price + " €"

  description.appendChild(h2)
  description.appendChild(p)
  description.appendChild(p2)
  return description
}

function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article)
}

// Article //
function addArticle(item) {
  const article = document.createElement("article")
  article.classList.add("cart__item")
  article.dataset.id = item.id
  article.dataset.color = item.color
  return article
}

// Div pour l'image du produit //
function addImageDiv(item) {
  const div = document.createElement("div")
  div.classList.add("cart__item__img")

  const image = document.createElement("img")
  image.src = item.imageUrl
  image.alt = item.altTxt
  div.appendChild(image)
  return div
}

// Fonction qui va afficher la quantité totale des produits //
function displayTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity")
  const total = cart.reduce((total, item) => total + item.quantity, 0)
  totalQuantity.textContent = total
}

// Fonction qui va afficher le prix totale des produits //
function displayTotalPrice() {
  const totalPrice = document.querySelector("#totalPrice")
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  totalPrice.textContent = total
}

function addCartContent(item) {
  const cartItemContent = document.createElement("div")
  cartItemContent.classList.add("cart__item__content")

  const description = addDescription(item)
  const settings = addSettings(item)

  cartItemContent.appendChild(description)
  cartItemContent.appendChild(settings)
  return cartItemContent
}

function addSettings(item) {
  const settings = document.createElement("div")
  settings.classList.add("cart__item__content__settings")

  addQuantityToSettings(settings, item)
  addDeleteToSettings(settings, item)
  return settings
}

function addDeleteToSettings(settings, item) {
  const div = document.createElement("div")
  div.classList.add("cart__item__content__settings__delete")
  div.addEventListener("click", () => deleteItem(item))

  const p = document.createElement("p")
  p.textContent = "Supprimer"
  div.appendChild(p)
  settings.appendChild(div)
}

// Supprimer article de la page //
function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  )
  cart.splice(itemToDelete, 1)
  displayTotalPrice()
  displayTotalQuantity()
  deleteDataFromCache(item)
  deleteArticleFromPage(item)
}
function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  )
  articleToDelete.remove()
}

// Paramètre des quantités //
function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div")
  quantity.classList.add("cart__item__content__settings__quantity")
  const p = document.createElement("p")
  p.textContent = "Qté : "
  quantity.appendChild(p)
  const input = document.createElement("input")
  input.type = "number"
  input.classList.add("itemQuantity")
  input.name = "itemQuantity"
  input.min = "1"
  input.max = "100"
  input.value = item.quantity
  input.addEventListener("input", () => updatePriceAndQuantity(item.id, input.value, item))

  quantity.appendChild(input)
  settings.appendChild(quantity)
}

// Mise à jour du prix et de la quantité //
function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id)
  itemToUpdate.quantity = Number(newValue)
  item.quantity = itemToUpdate.quantity
  displayTotalQuantity(item)
  displayTotalPrice()
  saveNewDataToCache()
}

// Supprimer les données du cache //
function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`
  localStorage.removeItem(key)
}

// Sauvegarder les nouvelles données //
function saveNewDataToCache(item) {
  const dataToSave = JSON.stringify(item)
  const key = `${item.id}-${item.color}`
  localStorage.setItem(key, dataToSave)
}

// Création du bouton "commander" //
const orderButton = document.querySelector("#order")
//Écoute du bouton commander sur le click pour pouvoir contrôler, valider et ennoyer le formulaire et les produits au back-end //
orderButton.addEventListener("click", (e) => submitForm(e))

function submitForm(e) {
  e.preventDefault()
  if (cart.length === 0) {
    alert("Merci d'ajouter un article")
    return
  }

  if (isAddressInvalid()) return
  if (isEmailInvalid()) return
  if (isFirstNameInvalid()) return
  if (isLastNameInvalid()) return
  if (isCityInvalid()) return

  const body = makeRequestBody()
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId
      window.location.href = "confirmation.html" + "?orderId=" + orderId
    })
    .catch((err) => console.error(err))
}

// Récupération des données du formulaire //
function makeRequestBody() {
  const form = document.querySelector(".cart__order__form")
  const firstName = form.elements.firstName.value
  const lastName = form.elements.lastName.value
  const address = form.elements.address.value
  const city = form.elements.city.value
  const email = form.elements.email.value
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email
    },
    products: getIdsFromCache()
  }
  return body
}

// Récupération des ids du cache //
function getIdsFromCache() {
  const numberOfProducts = localStorage.length
  const ids = []
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i)
    const id = key.split("-")[0]
    ids.push(id)
  }
  return ids
}

// Vérification de la validation des entrées //

// Régex pour le contrôle des champs Prénom //
function isFirstNameInvalid() {
  const firstName = document.querySelector("#firstName").value
  const regex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
  if (regex.test(firstName) === false) {
    let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    firstNameErrorMsg.innerText = "Merci de renseigner un prénom valide";

    return true
  }
  return false
}

// Régex pour le contrôle des champs Nom //
function isLastNameInvalid() {
  const lastName = document.querySelector("#lastName").value
  const regex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
  if (regex.test(lastName) === false) {
    let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    lastNameErrorMsg.innerText = "Merci de renseigner un nom valide";

    return true
  }
  return false
}

// Régex pour le contrôle des champs E-mail //
function isEmailInvalid() {
  const email = document.querySelector("#email").value
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
  if (regex.test(email) === false) {
    let emailErrorMsg = document.getElementById('emailErrorMsg');
    emailErrorMsg.innerText = "Merci de renseigner une adresse email valide";

    return true
  }
  return false
}

// Régex pour le contrôle des champs Adresse //
function isAddressInvalid() {
  const address = document.querySelector("#address").value
  const regex = /^[#.0-9a-zA-ZÀ-ÿ\s,'-]{2,60}$/
  if (regex.test(address) === false) {
    let addressErrorMsg = document.getElementById('addressErrorMsg');
    addressErrorMsg.innerText = "Merci de renseigner une adresse valide";

    return true
  }
  return false
}

// Régex pour le contrôle des champs Ville //
function isCityInvalid() {
  const city = document.querySelector("#city").value
  const regex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
  if (regex.test(city) === false) {
    let cityErrorMsg = document.getElementById('cityErrorMsg');
    cityErrorMsg.innerText = "Merci de renseigner une ville valide";

    return true
  }
  return false
}


