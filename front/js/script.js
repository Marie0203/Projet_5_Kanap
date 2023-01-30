// On récupère toutes les données de l'api
fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => addProducts(data))

// Création des produits via la liste récupérée
function addProducts(kanap) {
    kanap.forEach((kanap) => {
        const {_id, imageUrl, altTxt, name, description } = kanap
        const anchor = addAnchor(_id)
        const image = addImage(imageUrl, altTxt)
        const article = document.createElement("article")
        const h3 = addH3(name)
        const p = addParagraph(description)
        article.appendChild(image)
        article.appendChild(h3)
        article.appendChild(p)
        appendArticleToAnchor(anchor, article)
    })
}

// Insertion de l'élément "a"
function addAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
}

// Insertion de l'élément "article"
function appendArticleToAnchor(anchor, article) {
    const items = document.querySelector("#items")
    if (items) {
    items.appendChild(anchor)
    anchor.appendChild(article)
    }
}

// Insertion de l'image
function addImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

// Insertion du titre "h3"
function addH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}

// Insertion de la desccription "p"
function addParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}