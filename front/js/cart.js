const API_URL = "http://localhost:3000/api/products";

const api = {
  async fetchProductById(id) {
    // on récupère de Back/controller/Product.js les données par id
    const reponseOneProductById = await fetch(API_URL + "/" + id);
    return reponseOneProductById.json();
  }
};

//On récupere la valeur de la clé : panier du localStorage
var monPanier = JSON.parse(localStorage.getItem("panier"));
// Création des éléments dans le DOM nécessaire à l'affichage
monPanier.forEach((articleStorage, index) => {
  api.fetchProductById(articleStorage.id).then((product) => {
    let section = document.querySelector("#cart__items");

    let article = document.createElement("article");
    article.setAttribute("class", "cart__item");

    section.appendChild(article);

    let divItemImg = document.createElement("div");
    divItemImg.setAttribute("class", "cart__item__img");

    article.appendChild(divItemImg);

    let imgBalise = document.createElement("img");
    imgBalise.setAttribute("src", product.imageUrl);
    imgBalise.setAttribute("alt", product.altTxt);

    divItemImg.appendChild(imgBalise);

    let divItemContent = document.createElement("div");
    divItemContent.setAttribute("class", "cart__item__content");

    article.appendChild(divItemContent);

    let divItemContentDescription = document.createElement("div");
    divItemContentDescription.setAttribute(
      "class",
      "cart__item__content__description"
    );
    divItemContent.appendChild(divItemContentDescription);

    divItemContent.appendChild(divItemContentDescription);

    let contentTitle = document.createElement("h2");
    contentTitle.textContent = product.name;
    divItemContentDescription.appendChild(contentTitle);

    let contentColor = document.createElement("p");
    contentColor.textContent = articleStorage.color;

    divItemContentDescription.appendChild(contentColor);

    let contentPrice = document.createElement("p");
    contentPrice.textContent = product.price + ".00 €";

    divItemContentDescription.appendChild(contentPrice);

    let contentItemSettings = document.createElement("div");
    contentItemSettings.setAttribute("class", "cart__item__content__settings");

    divItemContent.appendChild(contentItemSettings);

    let contentItemSettingsQuantityInput = document.createElement("div");
    contentItemSettingsQuantityInput.setAttribute(
      "class",
      "cart__item__content__settings__quantity"
    );

    contentItemSettings.appendChild(contentItemSettingsQuantityInput);

    let itemSettingsQuantity = document.createElement("p");
    itemSettingsQuantity.textContent = "Qté :";

    contentItemSettingsQuantityInput.appendChild(itemSettingsQuantity);

    const optionInputCart = articleStorage.quantity;

    let itemSettingsInput = document.createElement("input");
    itemSettingsInput.setAttribute("type", "number");
    itemSettingsInput.setAttribute("name", "itemQuantity");
    itemSettingsInput.setAttribute("min", "1");
    itemSettingsInput.setAttribute("max", "100");
    itemSettingsInput.value = optionInputCart;
    itemSettingsInput.setAttribute("class", "itemQuantity");
    // Ecoute du changement de l'input afin d'actualisé sa quantité dans le localStorage
    itemSettingsInput.addEventListener("change", function () {
      monPanier[index].quantity = itemSettingsInput.value;
      localStorage.setItem("panier", JSON.stringify(monPanier));
      totalAndDisplayQtyPrice();
    });

    contentItemSettingsQuantityInput.appendChild(itemSettingsInput);
    // Création du bouton supprimer
    let btnDelete = document.createElement("p");
    btnDelete.setAttribute("class", "deleteItem");
    btnDelete.textContent = "Supprimer";
    article.appendChild(btnDelete);
    // Suppression dans le local storage de l'article total
    btnDelete.addEventListener("click", function () {
      //WARNING:"supprimer 1 produit supprime tout le produit, même si il la quantité est supérieur à 1"
      monPanier.splice(index, 1);
      // Envoi le nouveau panier au localStorage
      localStorage.setItem("panier", JSON.stringify(monPanier));
      // Indique de la suppression, et du total restant dans l'index
      alert('Articles retiré du panier');
      // Recharge la page pour nouvel affichage
      location.reload();
    });
  });
});

totalAndDisplayQtyPrice();
// Calcul du prix total des articles et affiche dans leurs balises html //
function totalAndDisplayQtyPrice() {
  var totalPrice = 0;
  var totalQuantity = 0;

  var monPanier = JSON.parse(localStorage.getItem("panier"));

  monPanier.forEach((articleStorage, index) => {
    api.fetchProductById(articleStorage.id).then((product) => {
      // Récupération du nombre d'article dans le localStorage
      var quantityProduct = parseInt(articleStorage.quantity);
      // Récupération du prix de chaque produits
      var priceProduct = product.price;
      // Calcul du nombre de produit
      totalQuantity = totalQuantity + quantityProduct;
      // Calcul du prix en fontion du nombre d'article
      totalPrice = totalPrice + priceProduct * quantityProduct;
      // Affichage du nombre articles total
      let baliseQuantity = document.getElementById("totalQuantity");
      baliseQuantity.innerText = totalQuantity;
      // Affichage du prix total des articles
      let balisePrice = document.getElementById("totalPrice");
      balisePrice.innerText = totalPrice;
    });
  });
}

var btnSubmit = document.getElementById("order");

btnSubmit.addEventListener("click", (event) => {
  // Eviter dans ce cas le rechargement de la page au click
  event.preventDefault();
  // on répcupére les valeurs des champs saisies
  var prenom = document.getElementById("firstName").value;
  var nom = document.getElementById("lastName").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var email = document.getElementById("email").value;
  // Création des variable de regex
  var regexPrenomNomVille = /^[A-ZÀ-ÿ][a-zà-ÿ-']*$/;
  var regexAddress = /^[0-9]+\s+(rue|avenue)\s+\w+(\s+\w+)*$/i;
  var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  var errorFirstName = document.getElementById("firstNameErrorMsg");
  var errorLastName = document.getElementById("lastNameErrorMsg");
  var erroraddressError = document.getElementById("addressErrorMsg");
  var errorCity = document.getElementById("cityErrorMsg");
  var errorEmail = document.getElementById("emailErrorMsg");
  // initialisation des champs en string vident afin de les remplir
  errorFirstName.innerText = "";
  errorLastName.innerText = "";
  erroraddressError.innerText = "";
  errorCity.innerText = "";
  errorEmail.innerText = "";

  var temoinForm = false;
  // ! = not //
  if (!regexPrenomNomVille.test(prenom)) {
    errorFirstName.innerText = "Veuillez mettre une Majuscule à votre Prénom";
    temoinForm = true;
  }
  if (!regexPrenomNomVille.test(nom)) {
    errorLastName.innerText = "Veuillez mettre une Majuscule à votre Nom";
    temoinForm = true;
  }
  if (!regexAddress.test(address)) {
    erroraddressError.innerText = "Veuillez revoir le format de votre adresse 1 Rue, Bis... de Californie";
    temoinForm = true;
  }
  if (!regexPrenomNomVille.test(city)) {
    errorCity.innerText = "Veuillez mettre une majuscule à votre Ville, ex: Nantes";
    temoinForm = true;
  }
  if (!regexEmail.test(email)) {
    errorEmail.innerText = "Format champ Email erroné, ex: john.wick@matrix.com";
    temoinForm = true;
  }
  // si tous les champs du formulaire sont correctement remplis, on valide les infos des champs  //
  if (temoinForm == true) {
    return;
  }
  // Création objet contact demandé pour requête back/api
  const contact = {
    firstName: prenom,
    lastName: nom,
    address: address,
    city: city,
    email: email,
  };
  // Création d'une liste ou tableau, afin de d'envoyer la liste de product.id demandé par le back //
  let listeID = [];

  monPanier.forEach((articleStorage) => {
    listeID.push(articleStorage.id);
  });
  // Création objet order avec les informations regroupées pour la requête //
  const order = {
    contact: contact,
    products: listeID,
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  };

  fetch("http://localhost:3000/api/products/order", options)
    .then((response) => response.json())
    .then((data) => {
      // Redirection vers la page confirmation avec l'orderId de la commande
      document.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch((err) => {
      // Erreur console et navigateur de prévu si requete non passée //
      console.log("Erreur Fetch product.js", err);
      alert("Un problème a été rencontré lors de l'envoi du formulaire.");
    });
});
