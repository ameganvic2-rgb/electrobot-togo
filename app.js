function nettoyerTexte(texte) {
  return texte.replace(/[<>{}]/g, "").trim();
}
// ---- Variables globales ----
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
      <img src="${produit.image}" alt="${produit.nom}" class="produit-image">
      <h3>${produit.nom}</h3>
      <p>${produit.prix} FCFA</p>
      <div class="ligne-quantite">
        <input type="number" id="qte-${produit.id}" value="1" min="1" max="99" class="input-quantite">
        <button onclick="ajouterAuPanier(${produit.id})">Ajouter</button>
      </div>
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

// ---- Ajouter un produit au panier (avec quantité) ----
function ajouterAuPanier(id) {
  const produit = produits.find(p => p.id === id);
  const inputQte = document.getElementById(`qte-${id}`);
  const quantite = parseInt(inputQte.value) || 1;

  // Si le produit est déjà dans le panier, on additionne la quantité
  const itemExistant = panier.find(item => item.id === id);
  if (itemExistant) {
    itemExistant.quantite += quantite;
  } else {
    panier.push({ ...produit, quantite: quantite });
  }

  mettreAJourPanier();
  inputQte.value = 1; // on remet le champ à 1 après ajout
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
  panier.forEach((item, index) => {
    const sousTotal = item.prix * item.quantite;
    total += sousTotal;
    const ligne = document.createElement("p");
    ligne.innerHTML = `${item.nom} x${item.quantite} - ${sousTotal} FCFA
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
  panier.forEach(item => {
    const sousTotal = item.prix * item.quantite;
    message += `- ${item.nom} x${item.quantite} (${sousTotal} FCFA)%0A`;
    total += sousTotal;
  });
  message += `%0ATotal : ${total} FCFA`;

  const numeroWhatsApp = "22890925549"; // ton vrai numéro ici
  window.open(`https://wa.me/${numeroWhatsApp}?text=${message}`, "_blank");
});

// ---- Fonction de nettoyage (sécurité) ----
function nettoyerTexte(texte) {
  return texte.replace(/[<>{}]/g, "").trim();
}

// ---- Affichage initial ----
afficherProduits(produits);
