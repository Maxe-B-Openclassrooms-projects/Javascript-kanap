// adresse url, du back ou de l'api
const API_URL = "http://localhost:3000/api/products"; // on parametre l'adresse du back ( ou tapper )

const api = {
  // on requete l'api pour demander l'ensemble des produits, ou seulement un produit par id //
  async fetchProductsAll() {
    // on récupère les données de Product.js //
    const reponseAllProducts = await fetch(API_URL);
    return reponseAllProducts.json();
  },
  async fetchProductById(id) {
    // on récupère de Product.js les données par id //
    const reponseOneProductById = await fetch(API_URL + "/" + id);
    return reponseOneProductById.json();
  },
};
// Récupère l'id du produit et on l'injecte dans l'Url.//
const getProductId = () => {
  const url = new URL(document.location).searchParams;

  return url.get(`id`);
};

const id = getProductId();
// une fois l'id récupérée, récupération de ses informations //
// objet api => vers funtion fetchbyid
api.fetchProductById(id).then((product) => {
  // Product contient toutes les informations d'un produit de l'api
  document.querySelector("#price").textContent = product.price;
  document.querySelector("#description").textContent = product.description;
  // Récupère les couleurs du produits
  const options = product.colors
    // pour chaque couleur on crée une option qui sera dans le selecteur html
    .map((color) => `<option value="${color}">${color}</option>`)
    .join();
  document.querySelector(
    "#colors"
  ).innerHTML = `<option value="">--SVP, choisissez une couleur --</option>${options}`;

  const myContainer = document.querySelector(".item__img");
  const imgSinglePage = document.createElement("img");

  imgSinglePage.setAttribute("src", product.imageUrl);
  imgSinglePage.setAttribute("alt", product.altTxt);
  myContainer.appendChild(imgSinglePage);
});

let btnAddStorage = document.getElementById("addToCart");

btnAddStorage.addEventListener("click", function () {
  let optionsColor = document.getElementById("colors");
  let optionsQuantity = document.getElementById("quantity");

  if (optionsColor.value == "") {
    alert("Veuillez selectionné une couleur, sans cela impossible de confirmé votre superbe choix");
    return;
  }
  if (
    parseInt(optionsQuantity.value) < 1 ||
    parseInt(optionsQuantity.value) >= 100
  ) {
    alert(
      "Ouups aucunes quantités n'a été choisies :)"
    );
    return;
  }
// Objet envoyé au localStorage // parseInt  analyse une chaîne de caractère fournie en argument
// et renvoie un nombre entier //
  let articleOrder = {
    id: id,
    color: optionsColor.value,
    quantity: parseInt(optionsQuantity.value),
  };

  let myLocalStorage = getPanier();

  if (myLocalStorage == null) {
    myLocalStorage = [];
  }

  let temoin = false;

  myLocalStorage.forEach((oneArticlePanier, index) => {
    if (
      oneArticlePanier.id == articleOrder.id &&
      oneArticlePanier.color == articleOrder.color
    ) {
      // Incrémente la quantité pour éviter doublons //
      myLocalStorage[index].quantity += articleOrder.quantity;
      temoin = true;
    }
  });

  if (temoin == false) {
    // Si false, ajout de l'article //
    myLocalStorage.push(articleOrder);
  }
  // Function permettant d'ajouté un produit au localStorage stringuifié //
  setPanier(myLocalStorage);
  alert("Votre article à bien été ajouté à votre panier");
  document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
  document.querySelector("#addToCart").textContent = "Produit ajouté !";
  // setTimeout executera le reload au bout d'une seconde //
  setTimeout(() => { location.reload() }, 1000);
});

// Envoi un article de type string au localStorage en lui passant le nom de sa clé "panier"//
function setPanier(articleOrder) {
  localStorage.setItem("panier", JSON.stringify(articleOrder));
}
// Récupère la valeur panier //
function getPanier() {
  let panier = JSON.parse(localStorage.getItem("panier"));
  return panier;
}
