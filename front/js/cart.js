
// Déclaration de la variable "localStorageProducts" dans laquelles on met les key et les values qui sont dans le local stockage //
let localStorageProducts = JSON.parse(localStorage.getItem("produits"));

// Variable pour stocker les id de chaque articles présents dans le panier //
let products = [];

// Création d'une boucle dans laquelle ont injecte notre code grâce à un innerHTML //

let i = 0;

for (product of localStorageProducts) {

  // Appel de la fonction FETCH //
  fetch('http://localhost:3000/api/products/' + product.id)
    .then((response) => response.json())
    .then((data) => {

      //Création du tableau pour les produits à envoyer au serveur //
      products.push(product.id);


      localStorageProducts[i].imageUrl = data.imageUrl;
      localStorageProducts[i].altTxt = data.altTxt;
      localStorageProducts[i].name = data.name;
      localStorageProducts[i].price = data.price;


      document.querySelector('#cart__items').innerHTML += `<article class="cart__item" data-id= ${localStorageProducts[i].id}  data-color= ${localStorageProducts[i].colors}>
            <div class="cart__item__img">
                <img src=${localStorageProducts[i].imageUrl} alt=${localStorageProducts[i].altTxt}>
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${localStorageProducts[i].name}</h2>
                    <p>${localStorageProducts[i].colors}</p>
                    <p>${localStorageProducts[i].price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${localStorageProducts[i].quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;

      totalPriceQuantity();
      deleteProduct();
      settingValue();

      i++;

    });

}


// Déclaration d'une const avec une fonction qui va afficher la quantité et le prix total des produits //
const totalPriceQuantity = () => {

  // La quantité de chaque articles qui est dans le local storage //
  var quantityTotalCalcul = 0;

  // Le prix de chaque articles qui est dans le local storage //
  var priceTotalCalcul = 0;

  for (let i = 0; i < localStorageProducts.length; i++) {

    // Déclaration d'une variable dans laquelle ont va chercher la quantité de tout les articles et que l'on met dans quantityTotalCalcul //
    let quantityProduitDansLePanier = localStorageProducts[i].quantity;
    quantityTotalCalcul += parseInt(quantityProduitDansLePanier);

    // Déclaration d'une variable dans laquelle ont va chercher le prix de chaque articles et que l'on met dans priceTotalCalcul //
    let priceProduitDansLePanier = localStorageProducts[i].price * localStorageProducts[i].quantity;
    priceTotalCalcul += priceProduitDansLePanier;

  }

  // Affichage des résultat grâce à innerHtml //
  document.querySelector('.cart__price').innerHTML = `<p>Total (<span id="totalQuantity">${quantityTotalCalcul}</span> articles) : <span id="totalPrice">${priceTotalCalcul}</span> €</p>`;
}

// Modification de la quantité des articles //
function settingValue() {

  let inputQuantity = Array.from(document.querySelectorAll(".cart__item__content__settings__quantity input"));
  let valueQuantity = Array.from(document.querySelectorAll('.itemQuantity'));


  // Boucle pour aller chercher tout les input dans lequelle on effectue un addEventListener pour changer la valeur des articles //
  for (let i = 0; i < inputQuantity.length; i++) {

    inputQuantity[i].addEventListener("change", () => {

      // Copie du tableau localStorageProducts //
      tabUpdate = localStorageProducts;

      // Création d'une boucle pour supprimer dans le local storage les valeurs altxt, imageUrl, name et price // 
      for (let i = 0; i < tabUpdate.length; i++) {

        delete tabUpdate[i].altTxt;
        delete tabUpdate[i].imageUrl;
        delete tabUpdate[i].name;
        delete tabUpdate[i].price;
      }

      // On modifie la quantité d'un élément à chaque index [i] du tableau écouté //
      tabUpdate[i].quantity = valueQuantity[i].value;

      // Mise à jour du local storage //
      localStorage.setItem("produits", JSON.stringify(tabUpdate));

      // Rafraîchissement de la page //
      window.location.reload();

      totalPriceQuantity();
    });
  }
}

// Fonction de suppression des articles //
function deleteProduct() {

  // Récupération bouton supprimer et transformation en tableau //
  let btn_delete = Array.from(document.querySelectorAll(".deleteItem"));

  // Nouveau tableau pour récupérer le tableau localStorageProducts existant et contrôler les suppression //
  let tabDelete = [];
  for (let i = 0; i < btn_delete.length; i++) {

    // Écoute d'évènements au click sur le tableau des boutons supprimer
    btn_delete[i].addEventListener("click", () => {

      // Suppression de l'article sur la page //
      btn_delete[i].style.display = "none";

      // Copie du tableau localStorageProducts //
      tabDelete = localStorageProducts;


      //Création d'une boucle pour supprimer dans le local storage les valeurs altxt, imageUrl, name et prix. //

      for (let i = 0; i < tabDelete.length; i++) {

        delete tabDelete[i].altTxt;
        delete tabDelete[i].imageUrl;
        delete tabDelete[i].name;
        delete tabDelete[i].price;

      }


      // Supprime un élément à chaque index [i] du tableau écouté //
      tabDelete.splice([i], 1);

      // Mise à jour du local storage //
      localStorageProducts = localStorage.setItem("produits", JSON.stringify(tabDelete));


      // Rafraîchissement de la page //
      window.location.reload();
    });
  }
}

// Sélection du bouton commander //
let orderButton = document.querySelector('#order');

//Écoute du bouton commander sur le click pour pouvoir contrôler, valider et ennoyer le formulaire et les produits au back-end //
orderButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (isFirstNameInvalid() && isLastNameInvalid() && isAddressInvalid() && isCityInvalid() && isEmailInvalid()) {
    localStorage.setItem("contact", JSON.stringify(contact));
    sendFromToServer();
  }

  if (products.length === 0) {
    alert("Merci d'ajouter un article")
    return
  }

  //Récupération des valeur du formulaire //
  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,

  };

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

      return true;
    }
    return false;
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
  if (isAddressInvalid()) return
  if (isEmailInvalid()) return
  if (isFirstNameInvalid()) return
  if (isLastNameInvalid()) return
  if (isCityInvalid()) return


  // Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST :
  var orderId = "";
  sendFromToServer();

  // Requête Post //
  function sendFromToServer() {
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })

      // Ensuite on stock la réponse de l'api (orderId) //
      .then((response) => {
        return response.json();
      })


      .then((server) => {
        orderId = server.orderId;
        // Si la variable orderId n'est pas vide on redirige notre utilisateur sur la page confirmation avec la variable //
        if (orderId != "") {
          location.href = "confirmation.html?id=" + orderId;
        }
      })
  }
})



