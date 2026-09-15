function nettoyerTexte(texte) {
  return texte.replace(/[<>{}]/g, "").trim();
}
// ---- Variables globales ----
function nettoyerTexte(texte) {
  return texte.replace(/[<>{}]/g, "").trim();
}
let panier = [];

// ---- Affichage du catalogue ----
function afficherProduits(liste) {
  const conteneur = document.getElementById("catalogue");
  conteneur.innerHTML = "";

  if (liste.length === 0) {
    conteneur.innerHTML = "<p>Aucun produit trouvé.</p>";
    return;
  }

  liste.forEach(produit => {
    const carte = document.createElement("div");
    carte.className = "produit-carte";
    carte.innerHTML = `
      <h3>${produit.nom}</h3>
      <p>${produit.prix} FCFA</p>
      <button onclick="ajouterAuPanier(${produit.id})">Ajouter</button>
    `;
    conteneur.appendChild(carte);
  });
}

// ---- Recherche ----
document.getElementById("recherche").addEventListener("input", function () {
  const texte = this.value.toLowerCase();
  const resultats = produits.filter(p =>
    p.nom.toLowerCase().includes(texte) ||
    p.categorie.toLowerCase().includes(texte)
  );
  afficherProduits(resultats);
});

// ---- Ajouter un produit au panier ----
function ajouterAuPanier(id) {
  const produit = produits.find(p => p.id === id);
  panier.push(produit);
  mettreAJourPanier();
}

// ---- Retirer un produit du panier ----
function retirerDuPanier(index) {
  panier.splice(index, 1);
  mettreAJourPanier();
}

// ---- Mettre à jour l'affichage du panier ----
function mettreAJourPanier() {
  const conteneurPanier = document.getElementById("panier");
  const totalEl = document.getElementById("total");
  conteneurPanier.innerHTML = "";

  let total = 0;
  panier.forEach((produit, index) => {
    total += produit.prix;
    const ligne = document.createElement("p");
    ligne.innerHTML = `${produit.nom} - ${produit.prix} FCFA
      <button onclick="retirerDuPanier(${index})">✕</button>`;
    conteneurPanier.appendChild(ligne);
  });

  totalEl.textContent = total;
}

// ---- Passer la commande via WhatsApp ----
document.getElementById("commander").addEventListener("click", function () {
const nom = nettoyerTexte(document.getElementById("nom").value);
const tel = nettoyerTexte(document.getElementById("telephone").value);
const adresse = nettoyerTexte(document.getElementById("adresse").value);

  if (panier.length === 0) {
    alert("Votre panier est vide !");
    return;
  }
  if (!nom || !tel || !adresse) {
    alert("Merci de remplir votre nom, téléphone et lieu de livraison.");
    return;
  }

  let message = `Nouvelle commande - ElectroBot Togo%0A%0A`;
  message += `Nom : ${nom}%0ATéléphone : ${tel}%0ALieu de livraison : ${adresse}%0A%0A`;
  message += `Articles :%0A`;
  let total = 0;
  panier.forEach(p => {
    message += `- ${p.nom} (${p.prix} FCFA)%0A`;
    total += p.prix;
  });
  message += `%0ATotal : ${total} FCFA`;

  const numeroWhatsApp = "22890925549"; // remplace par ton vrai numéro WhatsApp
  window.open(`https://wa.me/${numeroWhatsApp}?text=${message}`, "_blank");
});

// ---- Affichage initial ----
afficherProduits(produits);
