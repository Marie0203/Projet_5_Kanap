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
  
  
  saveOrder(color, quantity)
  redirectToCart()

}

// Enregistrer la commande //
function saveOrder(color, quantity) {
  const key = `${id}-${color}`
  const data = {
    id: id,
    color: color,
    quantity: Number(quantity),
  }
  // SI la colors ne vaut rien, veuillez choisir une couleur //
  if (color == '') {
    alert('Veuillez sélectionner une couleur');
    return;
  }

  //SI NON SI la quantity est inférieur à 1 veuillez choisir une quantités valide //
  else if (quantity < 1) {
    alert('Veuillez sélectionner un nombre d\'articles souhaités');
    return;
  }


  //SI NON SI la quantity est supérieur à 100 veuillez choisir une quantités entre 1 à 100 produits //
  else if (quantity > 100) {
    alert('Vous pouvez seulement sélectionner 1 à 100 produits');
    return;
  }

  let productInLocalStorage =  JSON.parse(localStorage.getItem('product'));

  // j'ajoute les produits sélectionnés dans le localStorage
  const addProductLocalStorage = () => {
  // je récupère la sélection de l'utilisateur dans le tableau de l'objet :
  // on peut voir dans la console qu'il y a les données,
  // mais pas encore stockées dans le storage à ce stade

  productInLocalStorage.push(selection);
  // je stocke les données récupérées dans le localStorage :
  // JSON.stringify permet de convertir les données au format JavaScript en JSON 
  // vérifier que key et value dans l'inspecteur contiennent bien des données
  localStorage.setItem('product', JSON.stringify(productInLocalStorage));
  }

  localStorage.setItem(key, JSON.stringify(data))
  alert("Le produit à bien été ajouter au panier")
}

// Redirection vers le panier //
function redirectToCart() {
  window.location.href = "cart.html"
}



