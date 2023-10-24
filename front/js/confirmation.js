// Récupére l'ID de commande //
const getProductId = () => {
  const url = new URL(document.location).searchParams;
  return url.get(`orderId`);
};
// Affiche l'ID de commande dans le message de confirmation //
let baliseOrderID = document.getElementById("orderId");
baliseOrderID.innerText = getProductId();
// Supprime toutes les informations du localStorage, et reinitialise le panier
localStorage.clear();
