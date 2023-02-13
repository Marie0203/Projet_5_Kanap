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
  let select = document.querySelector('#colors');
// Boucle pour les couleurs //
  for (let i = 0; i < colors.length ; i++) {
    let option = document.createElement('option');
      option.value = colors[i];
      option.textContent = colors[i];
      select.append(option);
    }
  }


// Gestion du bouton "ajouter au panier" //
const button = document.querySelector("#addToCart")
button.addEventListener("click", handleClick)

function handleClick(e) {
      
  e.preventDefault();
  
  // Selection des id = #colors et #quantity //
  let colors = document.querySelector('#colors').value;
  let quantity = document.querySelector('#quantity').value;
  
  
  // Si la couleur ne vaut rien, veuillez choisir une couleur //
  if(colors == ''){
        alert('Veuillez sélectionner une couleur');
        return;
    }

    // Si non si la quantity est inférieur à 1 veuillez choisir une quantités valide //
    else if (quantity<1){
        alert('Veuillez sélectionner le nombre d\'articles souhaités');
        return;
    }

    
    // Si non si la quantity est supérieur à 100 veuillez choisir une quantités entre 1 à 100 produits //
    else if (quantity>100){
      alert('Vous pouvez seulement sélectionner 1 à 100 produits.');
      return;
    }
    
    
    // SI NON votre commande a bien ete enregistrée //
    else{
      alert('Votre article a bien été ajouté au panier');  
      window.location.href = "cart.html" 
    }
    
    
    // Enregistrement des valeurs dans un objet //
    const optionProduct = { 
      id: id,
      colors: colors,
      quantity: Number(quantity),
    }
    
    // Déclaration de la variable "localStorageProducts" dans laquelles on met les key et les values qui sont dans le local stockage //
    let localStorageProducts = JSON.parse(localStorage.getItem("produits"))
  
  // Si il y a deja des produit dans le locale storage //
  if (localStorageProducts) {
    
    // On recherche si l'id et la couleur d'un article est déjà présent //
    let item = localStorageProducts.find(
      (item) =>
      item.id == optionProduct.id && item.colors == optionProduct.colors
    );
      
      // Si oui on additionne les quantités des articles de même id et couleur et mise à jour du localstorageProducts //
      if (item) {
        item.quantity = item.quantity + optionProduct.quantity;
        localStorage.setItem("produits", JSON.stringify(localStorageProducts));
        
        return;
    }

    // Si l'article n'est pas déjà dans le local storage alors on push le nouvel article sélectionner //
    localStorageProducts.push(optionProduct);
    localStorage.setItem("produits", JSON.stringify(localStorageProducts));
   
  } 
  
  else {
    //  S'il n'y a pas de produits dans le locale stockage alors création d'un tableau dans le lequel on push l'objet "optionProduct";
    let newTabLocalStorage = [];
    newTabLocalStorage.push(optionProduct);
    localStorage.setItem("produits", JSON.stringify(newTabLocalStorage));
    
  }
}



