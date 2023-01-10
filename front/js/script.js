fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => addProducts(data))

function addProducts(data) {
    const imageUrl = data[0].imageUrl

    const product = document.createElement("a")
    product.href = imageUrl
    const items = document.querySelector("#items")
    if (items) {
        items.appendChild(product)
    }
}