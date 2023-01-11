fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => addProducts(data))

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

function addAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
}

function appendArticleToAnchor(anchor, article) {
    const items = document.querySelector("#items")
    if (items) {
    items.appendChild(anchor)
    anchor.appendChild(article)
    }
}

function addImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

function addH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}

function addParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}