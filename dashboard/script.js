// Applique le thème sauvegardé
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Affiche le nom utilisateur dans la sidebar
const nom = localStorage.getItem("username");
if (nom) {
  document.getElementById("sidebar-username").textContent = nom;
  document.getElementById("sidebar-avatar").textContent = nom
    .charAt(0)
    .toUpperCase();
}

// 0 - Tableau global des transactions (source de vérité)
const transactions = [];

// ─────────────────────────────────────────────
// FONCTION UTILITAIRE : crée un élément DOM pour une transaction
// Appelée à chaque fois qu'on a besoin d'afficher une ligne
// ─────────────────────────────────────────────
function creerElementTransaction(transaction) {
  const item = document.createElement("div");
  item.className = `transaction-item ${transaction.type}`;
  item.dataset.id = transaction.id;

  item.innerHTML = `
    <span>${transaction.description}</span>
    <span>${transaction.categorie}</span>
    <span class="${transaction.type}">
      ${transaction.type === "expense" ? "- " : "+ "}${transaction.montant} €
    </span>
    <div class="transaction-actions">
      <button class="editButton" data-id="${transaction.id}"><i data-lucide="pencil"></i></button>
      <button class="suppButton" data-id="${transaction.id}"><i data-lucide="trash-2"></i></button>
    </div>
  `;

  return item; // on retourne l'élément, on ne l'insère pas ici
}

// ─────────────────────────────────────────────
// FONCTION : recalcule et affiche les soldes
// ─────────────────────────────────────────────
function updateSoldes() {
  const totalRevenus = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.montant, 0);
  const totalDepenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.montant, 0);
  const solde = totalRevenus - totalDepenses;

  document.getElementById("solde-total").textContent = solde.toFixed(2) + " €";
  document.getElementById("total-revenus").textContent =
    "+ " + totalRevenus.toFixed(2) + " €";
  document.getElementById("total-depenses").textContent =
    "- " + totalDepenses.toFixed(2) + " €";
}

// ─────────────────────────────────────────────
// INITIALISATION : chargement des données depuis localStorage
// ─────────────────────────────────────────────
const donneesStockees = localStorage.getItem("transactions");
const liste = document.getElementById("transactions-list");

if (donneesStockees) {
  const transactionsSauvegardees = JSON.parse(donneesStockees);

  transactionsSauvegardees.forEach(function (transaction) {
    transactions.push(transaction);
    const item = creerElementTransaction(transaction); // ← on réutilise la fonction
    liste.appendChild(item);
  });

  updateSoldes();
  lucide.createIcons();
}

// ─────────────────────────────────────────────
// AJOUT d'une transaction via le formulaire
// ─────────────────────────────────────────────
const addButton = document.getElementById("button-add");

addButton.addEventListener("click", function () {
  const description = document.getElementById("description").value;
  const montant = document.getElementById("montant").value;
  const type = document.getElementById("type").value;
  const categorie = document.getElementById("categorie").value;

  const transaction = {
    id: Date.now(),
    description: description,
    montant: parseFloat(montant),
    type: type,
    categorie: categorie,
  };

  transactions.push(transaction);
  updateSoldes();
  localStorage.setItem("transactions", JSON.stringify(transactions));

  const item = creerElementTransaction(transaction); // ← même fonction, même HTML
  liste.appendChild(item);
  lucide.createIcons();

  // Réinitialisation du formulaire
  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";
});

// ─────────────────────────────────────────────
// ACTIONS sur la liste : suppression, édition, sauvegarde
// ─────────────────────────────────────────────
liste.addEventListener("click", function (event) {
  // 3.1 - Suppression
  const boutonSupp = event.target.closest(".suppButton");
  if (boutonSupp) {
    const confirmation = confirm("Supprimer cette transaction ?");
    if (!confirmation) return;

    const id = parseInt(boutonSupp.dataset.id);
    const index = transactions.findIndex((t) => t.id === id);
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    boutonSupp.closest(".transaction-item").remove();
    updateSoldes();
  }

  // 3.2 - Passage en mode édition
  const boutonEdit = event.target.closest(".editButton");
  if (boutonEdit) {
    const id = parseInt(boutonEdit.dataset.id);
    const transaction = transactions.find((t) => t.id === id);
    const item = boutonEdit.closest(".transaction-item");

    item.innerHTML = `
      <input class="edit-input" type="text" value="${transaction.description}" data-field="description" />
      <input class="edit-input" type="number" value="${transaction.montant}" data-field="montant" />
      <select class="edit-input" data-field="type">
        <option value="income" ${transaction.type === "income" ? "selected" : ""}>Revenu</option>
        <option value="expense" ${transaction.type === "expense" ? "selected" : ""}>Dépense</option>
      </select>
      <button class="saveButton" data-id="${id}"><i data-lucide="check"></i></button>
    `;
    lucide.createIcons();
  }

  // 3.3 - Sauvegarde après édition
  const boutonSave = event.target.closest(".saveButton");
  if (boutonSave) {
    const id = parseInt(boutonSave.dataset.id);
    const item = boutonSave.closest(".transaction-item");
    const inputs = item.querySelectorAll(".edit-input");

    const index = transactions.findIndex((t) => t.id === id);
    transactions[index].description = inputs[0].value;
    transactions[index].montant = parseFloat(inputs[1].value);
    transactions[index].type = inputs[2].value;

    localStorage.setItem("transactions", JSON.stringify(transactions));

    const nouvelItem = creerElementTransaction(transactions[index]); // ← encore elle !
    item.replaceWith(nouvelItem); // remplace l'ancien élément par le nouveau
    lucide.createIcons();
    updateSoldes();
  }
});

// Initialisation des icônes Lucide au chargement
lucide.createIcons();
