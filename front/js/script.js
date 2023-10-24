// Adresse url, du back ou de l'api
const API_URL = "http://localhost:3000/api/products"; // on parametre l'adresse du back, GET par défaut ( ou tapper )

const api = {
  // Requête l'api pour demander l'ensemble des produits, ou seulement un produit par id
  async fetchProductsAll() {
    const reponseAllProducts = await fetch(API_URL); // on récupère les données de Product.js
    return reponseAllProducts.json();
  },
  async fetchProductById(id) {
    const reponseOneProductById = await fetch(API_URL + "/" + id); // on récupère de Product.js les données par id
    return reponseOneProductById.json();
  },
};

// Function est utilisé lors de l'envoi des données au dom, elle permet de créer et lier les éléments entre eux.
function displayArticle(product) {

  let link = document.createElement("a");
  // on lie la variable link, à son option href, qui égale l'id du produit. la manière d'écrire entre backticks permet de rendre dinamique la variable : concatène l'adresse avec l'id du produit.
  link.href = `./product.html?id=${product._id}`;
  let article = document.createElement("article");
  let img = document.createElement("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);
  // crée un h3 et lie le h3 à son objet json : name
  let h3 = document.createElement("h3");
  h3.textContent = product.name;
  let p = document.createElement("p");
  p.textContent = product.description;

  // .append permet de lié un ou des éléments à un autre
  article.append(img, h3, p);
  link.append(article);
  // append child un élément principal
  let section = document.getElementById("items");
  section.appendChild(link);
}

async function displayData() {
  const listData = await api.fetchProductsAll();
  // On boucle sur products, pour récupérer chaques éléments,
  // Pour créer l'affichage de chacuns des kanaps,
  // en appelant displayArticle pour chaque articles via la boucle forof.
  for (product of listData) {
    displayArticle(product);
  }
}
displayData();







