// Récupération de l'id du produit sélectionné en page d'accueil dans l'URL //
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")

// Récupération des articles de l'API pour récupérer les détails du produit //
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => productData(res))

function productData(kanap) {
  const { altTxt, colors, description, imageUrl, name, price } = kanap
  addImage(imageUrl, altTxt)
  addTitle(name)
  addPrice(price)
  addDescription(description)
  addColors(colors)
}

// Image du produit //
function addImage(imageUrl, altTxt) {
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  const parent = document.querySelector(".item__img")
  if (parent != null) parent.appendChild(image)
}

// Titre //
function addTitle(name) {
  const h1 = document.querySelector("#title")
  if (h1 != null) h1.textContent = name
}

// Prix //
function addPrice(price) {
  const span = document.querySelector("#price")
  if (span != null) span.textContent = price
}

// Description //
function addDescription(description) {
  const p = document.querySelector("#description")
  if (p != null) p.textContent = description
}

// Couleurs //
function addColors(colors) {
  const select = document.querySelector("#colors")
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement("option")
      option.value = color
      option.textContent = color
      select.appendChild(option)
    })
  }
}

// Gestion du panier //
const button = document.querySelector("#addToCart")
button.addEventListener("click", handleClick)

function handleClick() {
  const color = document.querySelector("#colors").value
  const quantity = document.querySelector("#quantity").value

  if (isOrderInvalid(color, quantity)) return
  saveOrder(color, quantity)
  redirectToCart()
  }


function saveOrder(color, quantity) {
  const key = `${id}-${color}`
  const data = {
    id: id,
    color: color,
    quantity: Number(quantity)
  }
  localStorage.setItem(key, JSON.stringify(data))
  alert("Le produit à bien été ajouter au panier")
}

function isOrderInvalid(color, quantity) {
  if (color == null || color === "" || quantity == null || quantity == 0) {
    alert("Merci de sélectionner une couleur et une quantité")
    return true
  }
}
function redirectToCart() {
  window.location.href = "cart.html"
}




